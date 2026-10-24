import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../../store/slices/coursesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCourseAsync } from "../../../store/slices/adminSlice";

export default function EditCourse() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentCourse, detailLoading } = useSelector((state) => state.courses);
    const { creating, error } = useSelector((state) => state.admin);

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructorName: "",
        price: 0,
        category: "",
        tags: "",
        batches: [],
        syllabus: [],
    });

    useEffect(() => {
        if (!currentCourse || currentCourse._id !== id) {
            dispatch(fetchCourseById(id));
        }
    }, [dispatch, id, currentCourse]);

    useEffect(() => {
        if (currentCourse && currentCourse._id === id) {
            setForm({
                title: currentCourse.title || "",
                description: currentCourse.description || "",
                instructorName: currentCourse.instructorName || "",
                price: currentCourse.price || 0,
                category: currentCourse.category || "",
                tags: (currentCourse.tags || []).join(", "),
                batches: currentCourse.batches || [],
                syllabus: currentCourse.syllabus || [],
            });
        }
    }, [currentCourse, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const addBatch = () => {
        setForm((prev) => ({
            ...prev,
            batches: [...prev.batches, { name: "", startDate: "" }],
        }));
    };

    const removeBatch = (idx) => {
        setForm((prev) => ({
            ...prev,
            batches: prev.batches.filter((_, i) => i !== idx),
        }));
    };

    const updateBatch = (idx, field, value) => {
        setForm((prev) => {
            const newBatches = [...prev.batches];
            newBatches[idx] = { ...newBatches[idx], [field]: value };
            return { ...prev, batches: newBatches };
        });
    };

    const formatDateForInput = (dateVal) => {
        if (!dateVal) return "";
        try {
            if (typeof dateVal === "string") return dateVal.split("T")[0];
            return new Date(dateVal).toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: form.title,
            description: form.description,
            instructorName: form.instructorName,
            price: form.price,
            category: form.category,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            batches: form.batches.map((b) => ({
                ...b,
                startDate: b.startDate ? new Date(b.startDate) : undefined,
            })),
            syllabus: form.syllabus,
        };

        dispatch(updateCourseAsync({ id, data: payload })).then((res) => {
            if (!res.error) {
                navigate("/admin/courses");
            }
        });
    };

    if (detailLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full">
            <h1 className="page-heading mb-4 sm:mb-6">Edit Course</h1>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Course Title *</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter course title"
                        className="input input-bordered"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Description *</span>
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Course description"
                        className="textarea textarea-bordered h-28"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Instructor Name *</span>
                        </label>
                        <input
                            type="text"
                            name="instructorName"
                            value={form.instructorName}
                            onChange={handleChange}
                            placeholder="Instructor name"
                            className="input input-bordered"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Price (৳) *</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price in taka"
                            className="input input-bordered"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Category</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g., Web Development"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Tags (comma separated)</span>
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, web"
                            className="input input-bordered"
                        />
                    </div>
                </div>

                {/* Syllabus Section */}
                <div className="divider">Course Syllabus (Modules & Lessons)</div>
                <div className="space-y-4">
                    {form.syllabus.map((module, modIdx) => (
                        <div key={modIdx} className="card bg-base-100 border border-base-300">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Module {modIdx + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm((prev) => ({
                                                ...prev,
                                                syllabus: prev.syllabus.filter((_, i) => i !== modIdx),
                                            }));
                                        }}
                                        className="btn btn-sm btn-error"
                                    >
                                        Remove Module
                                    </button>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">Module Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={module.title || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setForm((prev) => ({
                                                ...prev,
                                                syllabus: prev.syllabus.map((mod, i) =>
                                                    i === modIdx ? { ...mod, title: val } : mod
                                                ),
                                            }));
                                        }}
                                        placeholder="e.g., Introduction to React"
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {/* Lessons */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">Lessons</h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    syllabus: prev.syllabus.map((mod, i) =>
                                                        i === modIdx
                                                            ? {
                                                                  ...mod,
                                                                  lessons: [
                                                                      ...(mod.lessons || []),
                                                                      {
                                                                          title: "",
                                                                          videoUrl: "",
                                                                          liveClassLink: "",
                                                                          liveClassDate: "",
                                                                          assignmentPrompt: "",
                                                                          quiz: [],
                                                                      },
                                                                  ],
                                                              }
                                                            : mod
                                                    ),
                                                }));
                                            }}
                                            className="btn btn-sm btn-outline"
                                        >
                                            + Add Lesson
                                        </button>
                                    </div>

                                    {module.lessons?.map((lesson, lesIdx) => (
                                        <div key={lesIdx} className="card bg-base-200 border border-base-300">
                                            <div className="card-body">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h5 className="font-semibold">Lesson {lesIdx + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                    mIdx === modIdx
                                                                        ? {
                                                                              ...mod,
                                                                              lessons: mod.lessons.filter((_, i) => i !== lesIdx),
                                                                          }
                                                                        : mod
                                                                ),
                                                            }));
                                                        }}
                                                        className="btn btn-xs btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">Lesson Title *</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={lesson?.title || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                        mIdx === modIdx
                                                                            ? {
                                                                                  ...mod,
                                                                                  lessons: mod.lessons.map((les, lIdx) =>
                                                                                      lIdx === lesIdx ? { ...les, title: val } : les
                                                                                  ),
                                                                              }
                                                                            : mod
                                                                    ),
                                                                }));
                                                            }}
                                                            placeholder="e.g., Setting up React"
                                                            className="input input-bordered input-sm"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">Video URL (YouTube) *</span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={lesson?.videoUrl || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                        mIdx === modIdx
                                                                            ? {
                                                                                  ...mod,
                                                                                  lessons: mod.lessons.map((les, lIdx) =>
                                                                                      lIdx === lesIdx ? { ...les, videoUrl: val } : les
                                                                                  ),
                                                                              }
                                                                            : mod
                                                                    ),
                                                                }));
                                                            }}
                                                            placeholder="https://www.youtube.com/watch?v=..."
                                                            className="input input-bordered input-sm"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Live Class Section */}
                                                    <div className="form-control">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="label py-0">
                                                                <span className="label-text font-semibold">Live Class (Optional)</span>
                                                            </label>
                                                            {lesson?.liveClassLink === undefined ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                              lIdx === lesIdx
                                                                                                  ? { ...les, liveClassLink: "", liveClassDate: "" }
                                                                                                  : les
                                                                                          ),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    className="btn btn-sm btn-outline btn-info"
                                                                >
                                                                    + Add Live Class
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) => {
                                                                                              if (lIdx === lesIdx) {
                                                                                                  const { liveClassLink, liveClassDate, ...rest } = les;
                                                                                                  return rest;
                                                                                              }
                                                                                              return les;
                                                                                          }),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    className="btn btn-sm btn-ghost btn-error"
                                                                >
                                                                    Remove Live Class
                                                                </button>
                                                            )}
                                                        </div>

                                                        {lesson?.liveClassLink !== undefined && (
                                                            <div className="space-y-2">
                                                                <input
                                                                    type="url"
                                                                    value={lesson?.liveClassLink || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                              lIdx === lesIdx ? { ...les, liveClassLink: val } : les
                                                                                          ),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/xxxxx"
                                                                    className="input input-bordered input-sm w-full"
                                                                />
                                                                <input
                                                                    type="datetime-local"
                                                                    value={lesson?.liveClassDate ? new Date(lesson.liveClassDate).toISOString().slice(0, 16) : ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value ? new Date(e.target.value).toISOString() : "";
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                              lIdx === lesIdx ? { ...les, liveClassDate: val } : les
                                                                                          ),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    className="input input-bordered input-sm w-full"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Assignment Section */}
                                                    <div className="form-control">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="label py-0">
                                                                <span className="label-text font-semibold">Assignment</span>
                                                            </label>
                                                            {lesson?.assignmentPrompt === undefined ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                              lIdx === lesIdx ? { ...les, assignmentPrompt: "" } : les
                                                                                          ),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    className="btn btn-sm btn-outline btn-secondary"
                                                                >
                                                                    + Add Assignment
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                mIdx === modIdx
                                                                                    ? {
                                                                                          ...mod,
                                                                                          lessons: mod.lessons.map((les, lIdx) => {
                                                                                              if (lIdx === lesIdx) {
                                                                                                  const { assignmentPrompt, ...rest } = les;
                                                                                                  return rest;
                                                                                              }
                                                                                              return les;
                                                                                          }),
                                                                                      }
                                                                                    : mod
                                                                            ),
                                                                        }));
                                                                    }}
                                                                    className="btn btn-sm btn-ghost btn-error"
                                                                >
                                                                    Remove Assignment
                                                                </button>
                                                            )}
                                                        </div>

                                                        {lesson?.assignmentPrompt !== undefined && (
                                                            <textarea
                                                                value={lesson?.assignmentPrompt || ""}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setForm((prev) => ({
                                                                        ...prev,
                                                                        syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                            mIdx === modIdx
                                                                                ? {
                                                                                      ...mod,
                                                                                      lessons: mod.lessons.map((les, lIdx) =>
                                                                                          lIdx === lesIdx ? { ...les, assignmentPrompt: val } : les
                                                                                      ),
                                                                                  }
                                                                                : mod
                                                                        ),
                                                                    }));
                                                                }}
                                                                placeholder="Enter assignment instructions..."
                                                                className="textarea textarea-bordered textarea-sm w-full"
                                                                rows="3"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Quiz Section */}
                                                    <div className="form-control">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="label">
                                                                <span className="label-text">Quiz Questions (Optional)</span>
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setForm((prev) => ({
                                                                        ...prev,
                                                                        syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                            mIdx === modIdx
                                                                                ? {
                                                                                      ...mod,
                                                                                      lessons: mod.lessons.map((les, lIdx) =>
                                                                                          lIdx === lesIdx
                                                                                              ? {
                                                                                                    ...les,
                                                                                                    quiz: [
                                                                                                        ...(les.quiz || []),
                                                                                                        {
                                                                                                            question: "",
                                                                                                            options: ["", "", "", ""],
                                                                                                            correctIndex: 0,
                                                                                                        },
                                                                                                    ],
                                                                                                }
                                                                                              : les
                                                                                      ),
                                                                                  }
                                                                                : mod
                                                                        ),
                                                                    }));
                                                                }}
                                                                className="btn btn-xs btn-outline"
                                                            >
                                                                + Add Question
                                                            </button>
                                                        </div>

                                                        {lesson.quiz?.map((quizItem, qIdx) => (
                                                            <div key={qIdx} className="card bg-base-300 border border-base-400 mb-2">
                                                                <div className="card-body p-3">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span className="text-sm font-semibold">Question {qIdx + 1}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setForm((prev) => ({
                                                                                    ...prev,
                                                                                    syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                        mIdx === modIdx
                                                                                            ? {
                                                                                                  ...mod,
                                                                                                  lessons: mod.lessons.map((les, lIdx) =>
                                                                                                      lIdx === lesIdx
                                                                                                          ? {
                                                                                                                ...les,
                                                                                                                quiz: les.quiz.filter((_, i) => i !== qIdx),
                                                                                                            }
                                                                                                          : les
                                                                                                  ),
                                                                                              }
                                                                                            : mod
                                                                                    ),
                                                                                }));
                                                                            }}
                                                                            className="btn btn-xs btn-error"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>

                                                                    <input
                                                                        type="text"
                                                                        value={quizItem.question || ""}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                    mIdx === modIdx
                                                                                        ? {
                                                                                              ...mod,
                                                                                              lessons: mod.lessons.map((les, lIdx) =>
                                                                                                  lIdx === lesIdx
                                                                                                      ? {
                                                                                                            ...les,
                                                                                                            quiz: les.quiz.map((q, i) =>
                                                                                                                i === qIdx ? { ...q, question: val } : q
                                                                                                            ),
                                                                                                        }
                                                                                                      : les
                                                                                              ),
                                                                                          }
                                                                                        : mod
                                                                                ),
                                                                            }));
                                                                        }}
                                                                        placeholder="Enter question"
                                                                        className="input input-bordered input-sm mb-2"
                                                                    />

                                                                    <div className="space-y-1">
                                                                        {quizItem.options?.map((option, optIdx) => (
                                                                            <div key={optIdx} className="flex gap-2 items-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`quiz-${modIdx}-${lesIdx}-${qIdx}`}
                                                                                    checked={quizItem.correctIndex === optIdx}
                                                                                    onChange={() => {
                                                                                        setForm((prev) => ({
                                                                                            ...prev,
                                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                                mIdx === modIdx
                                                                                                    ? {
                                                                                                          ...mod,
                                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                                              lIdx === lesIdx
                                                                                                                  ? {
                                                                                                                        ...les,
                                                                                                                        quiz: les.quiz.map((q, i) =>
                                                                                                                            i === qIdx ? { ...q, correctIndex: optIdx } : q
                                                                                                                        ),
                                                                                                                    }
                                                                                                                  : les
                                                                                                          ),
                                                                                                      }
                                                                                                    : mod
                                                                                            ),
                                                                                        }));
                                                                                    }}
                                                                                    className="radio radio-xs"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    value={option || ""}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        setForm((prev) => ({
                                                                                            ...prev,
                                                                                            syllabus: prev.syllabus.map((mod, mIdx) =>
                                                                                                mIdx === modIdx
                                                                                                    ? {
                                                                                                          ...mod,
                                                                                                          lessons: mod.lessons.map((les, lIdx) =>
                                                                                                              lIdx === lesIdx
                                                                                                                  ? {
                                                                                                                        ...les,
                                                                                                                        quiz: les.quiz.map((q, i) =>
                                                                                                                            i === qIdx
                                                                                                                                ? {
                                                                                                                                      ...q,
                                                                                                                                      options: q.options.map((opt, oIdx) =>
                                                                                                                                          oIdx === optIdx ? val : opt
                                                                                                                                      ),
                                                                                                                                  }
                                                                                                                                : q
                                                                                                                        ),
                                                                                                                    }
                                                                                                                  : les
                                                                                                          ),
                                                                                                      }
                                                                                                    : mod
                                                                                            ),
                                                                                        }));
                                                                                    }}
                                                                                    placeholder={`Option ${optIdx + 1}`}
                                                                                    className="input input-bordered input-sm flex-1"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setForm((prev) => ({
                                ...prev,
                                syllabus: [...prev.syllabus, { title: "", lessons: [] }],
                            }));
                        }}
                        className="btn btn-outline btn-sm w-full"
                    >
                        + Add Module
                    </button>
                </div>

                {/* Batches Section */}
                <div className="divider">Batches (Optional)</div>
                <div className="space-y-3">
                    {form.batches.map((batch, idx) => (
                        <div key={idx} className="card bg-base-100 border border-base-300">
                            <div className="card-body">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Batch Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={batch.name || ""}
                                            onChange={(e) => updateBatch(idx, "name", e.target.value)}
                                            placeholder="e.g., Batch 1, Jan 2025"
                                            className="input input-bordered input-sm"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Start Date</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={formatDateForInput(batch.startDate)}
                                            onChange={(e) => updateBatch(idx, "startDate", e.target.value)}
                                            className="input input-bordered input-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeBatch(idx)}
                                    className="btn btn-sm btn-error mt-2"
                                >
                                    Remove Batch
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addBatch}
                        className="btn btn-outline btn-sm"
                    >
                        + Add Batch
                    </button>
                </div>

                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={creating}
                        className="btn btn-primary flex-1"
                    >
                        {creating ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Updating...
                            </>
                        ) : (
                            "Update Course"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/courses")}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}