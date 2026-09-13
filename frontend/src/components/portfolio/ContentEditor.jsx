import React, { useState } from "react";

function ContentEditor({ resume, setResume }) {
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  if (!resume) {
    return null;
  }

  // ==========================================
  // SAFE ARRAY CONVERSION
  // ==========================================

  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const skills = toArray(resume.skills);
  const experience = toArray(resume.experience);
  const education = toArray(resume.education);
  const projects = toArray(resume.projects);
  const certificates = toArray(resume.certificates);
  const achievements = toArray(resume.achievements);
  const languages = toArray(resume.languages);

  // ==========================================
  // PERSONAL DETAILS
  // ==========================================

  const updatePersonal = (field, value) => {
    setResume({
      ...resume,
      personal: {
        ...(resume.personal || {}),
        [field]: value,
      },
    });
  };

  // ==========================================
  // ABOUT
  // ==========================================

  const updateAbout = (value) => {
    setResume({
      ...resume,
      about: value,
    });
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setResume({
      ...resume,
      experience: updated,
    });
  };

  const deleteExperience = (index) => {
    const updated = [...experience];
    updated.splice(index, 1);
    setResume({
      ...resume,
      experience: updated,
    });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...experience,
        {
          role: "",
          company: "",
          location: "",
          duration: "",
          description: "",
        },
      ],
    });
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    setResume({
      ...resume,
      skills: [...skills, skill],
    });

    setNewSkill("");
  };

  const updateSkill = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;

    setResume({
      ...resume,
      skills: updatedSkills,
    });
  };

  const deleteSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);

    setResume({
      ...resume,
      skills: updatedSkills,
    });
  };

  // ==========================================
  // LANGUAGES
  // ==========================================

  const addLanguage = () => {
    const language = newLanguage.trim();

    if (!language) return;

    setResume({
      ...resume,
      languages: [...languages, language],
    });

    setNewLanguage("");
  };

  const updateLanguage = (index, value) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;

    setResume({
      ...resume,
      languages: updatedLanguages,
    });
  };

  const deleteLanguage = (index) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);

    setResume({
      ...resume,
      languages: updatedLanguages,
    });
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];

    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setResume({
      ...resume,
      education: updatedEducation,
    });
  };

  const deleteEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);

    setResume({
      ...resume,
      education: updatedEducation,
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...education,
        {
          degree: "",
          institution: "",
          year: "",
        },
      ],
    });
  };

  // ==========================================
  // PROJECTS
  // ==========================================

  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setResume({
      ...resume,
      projects: updatedProjects,
    });
  };

  const deleteProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);

    setResume({
      ...resume,
      projects: updatedProjects,
    });
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...projects,
        {
          title: "",
          description: "",
        },
      ],
    });
  };

  // ==========================================
  // CERTIFICATES
  // ==========================================

  const updateCertificate = (index, field, value) => {
    const updatedCertificates = [...certificates];

    updatedCertificates[index] = {
      ...updatedCertificates[index],
      [field]: value,
    };

    setResume({
      ...resume,
      certificates: updatedCertificates,
    });
  };

  const deleteCertificate = (index) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);

    setResume({
      ...resume,
      certificates: updatedCertificates,
    });
  };

  const addCertificate = () => {
    setResume({
      ...resume,
      certificates: [
        ...certificates,
        {
          name: "",
          issuer: "",
          year: "",
        },
      ],
    });
  };

  // ==========================================
  // ACHIEVEMENTS
  // ==========================================

  const updateAchievement = (index, value) => {
    const updatedAchievements = [...achievements];

    updatedAchievements[index] = value;

    setResume({
      ...resume,
      achievements: updatedAchievements,
    });
  };

  const deleteAchievement = (index) => {
    const updatedAchievements = [...achievements];
    updatedAchievements.splice(index, 1);

    setResume({
      ...resume,
      achievements: updatedAchievements,
    });
  };

  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [...achievements, ""],
    });
  };

  // ==========================================
  // INPUT STYLE
  // ==========================================

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500 transition";

  return (
    <div className="space-y-5">

      {/* =====================================
          PERSONAL DETAILS
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Content
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-5">
          Personal Details
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Name
            </label>

            <input
              type="text"
              value={resume.personal?.name || ""}
              onChange={(e) =>
                updatePersonal("name", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Professional Title
            </label>

            <input
              type="text"
              value={resume.personal?.title || ""}
              placeholder="e.g. Science Teacher, Nurse Specialist, Senior Accountant"
              onChange={(e) =>
                updatePersonal("title", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={resume.personal?.email || ""}
              onChange={(e) =>
                updatePersonal("email", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Phone
            </label>

            <input
              type="text"
              value={resume.personal?.phone || ""}
              onChange={(e) =>
                updatePersonal("phone", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Location
            </label>

            <input
              type="text"
              value={resume.personal?.location || ""}
              onChange={(e) =>
                updatePersonal("location", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Portfolio / Website URL
            </label>

            <input
              type="text"
              value={resume.personal?.portfolio_url || ""}
              placeholder="https://yourwebsite.com"
              onChange={(e) =>
                updatePersonal("portfolio_url", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              LinkedIn
            </label>

            <input
              type="text"
              value={resume.personal?.linkedin || ""}
              onChange={(e) =>
                updatePersonal("linkedin", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              GitHub (Optional)
            </label>

            <input
              type="text"
              value={resume.personal?.github || ""}
              onChange={(e) =>
                updatePersonal("github", e.target.value)
              }
              className={inputClass}
            />
          </div>

        </div>
      </div>


      {/* =====================================
          ABOUT
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          About
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          About Me
        </h2>

        <textarea
          value={resume.about || ""}
          onChange={(e) => updateAbout(e.target.value)}
          rows={6}
          className={`${inputClass} resize-none`}
          placeholder="Write something about yourself..."
        />

      </div>


      {/* =====================================
          EXPERIENCE
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Experience
            </p>
            <h2 className="text-lg font-semibold mt-1">
              Work History & Experience
            </h2>
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium transition"
          >
            + Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-400 font-semibold uppercase">
                  Role #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => deleteExperience(index)}
                  className="px-2.5 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Job Title / Role"
                  value={exp.role || ""}
                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Organization / Company / School / Hospital"
                  value={exp.company || ""}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location || ""}
                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Duration (e.g. 2021 - Present)"
                  value={exp.duration || ""}
                  onChange={(e) => updateExperience(index, "duration", e.target.value)}
                  className={inputClass}
                />
              </div>

              <textarea
                placeholder="Responsibilities, achievements, or work summary..."
                value={exp.description || ""}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          ))}

          {experience.length === 0 && (
            <p className="text-xs text-gray-500 italic">No experience added yet. Click "+ Add Experience" above to add your work history.</p>
          )}
        </div>
      </div>


      {/* =====================================
          SKILLS
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Skills
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Skills
        </h2>

        <div className="space-y-2">

          {skills.map((skill, index) => (

            <div
              key={index}
              className="flex items-center gap-2"
            >

              <input
                value={skill || ""}
                onChange={(e) =>
                  updateSkill(index, e.target.value)
                }
                className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() => deleteSkill(index)}
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

        <div className="flex gap-2 mt-4">

          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500"
          />

          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
          >
            Add
          </button>

        </div>

      </div>


      {/* =====================================
          EDUCATION
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Education
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Education
        </h2>

        <div className="space-y-4">

          {education.map((educationItem, index) => (

            <div
              key={index}
              className="p-4 rounded-xl bg-black/20 border border-white/10"
            >

              <input
                value={educationItem?.degree || ""}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "degree",
                    e.target.value
                  )
                }
                placeholder="Degree"
                className={`${inputClass} mb-2`}
              />

              <input
                value={educationItem?.institution || ""}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "institution",
                    e.target.value
                  )
                }
                placeholder="Institution"
                className={`${inputClass} mb-2`}
              />

              <input
                value={educationItem?.year || ""}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "year",
                    e.target.value
                  )
                }
                placeholder="Year"
                className={`${inputClass} mb-3`}
              />

              <button
                type="button"
                onClick={() => deleteEducation(index)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete Education
              </button>

            </div>

          ))}

        </div>

        <button
          type="button"
          onClick={addEducation}
          className="mt-4 w-full py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          + Add Education
        </button>

      </div>


      {/* =====================================
          PROJECTS
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Projects
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Projects
        </h2>

        <div className="space-y-4">

          {projects.map((project, index) => (

            <div
              key={index}
              className="p-4 rounded-xl bg-black/20 border border-white/10"
            >

              <input
                value={project?.title || ""}
                onChange={(e) =>
                  updateProject(
                    index,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Project title"
                className={`${inputClass} mb-2`}
              />

              <textarea
                value={project?.description || ""}
                onChange={(e) =>
                  updateProject(
                    index,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Project description"
                rows={4}
                className={`${inputClass} resize-none mb-3`}
              />

              <button
                type="button"
                onClick={() => deleteProject(index)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete Project
              </button>

            </div>

          ))}

        </div>

        <button
          type="button"
          onClick={addProject}
          className="mt-4 w-full py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          + Add Project
        </button>

      </div>


      {/* =====================================
          CERTIFICATES
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Certificates
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Certificates
        </h2>

        <div className="space-y-4">

          {certificates.map((certificate, index) => (

            <div
              key={index}
              className="p-4 rounded-xl bg-black/20 border border-white/10"
            >

              <input
                value={certificate?.name || ""}
                onChange={(e) =>
                  updateCertificate(
                    index,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Certificate name"
                className={`${inputClass} mb-2`}
              />

              <input
                value={certificate?.issuer || ""}
                onChange={(e) =>
                  updateCertificate(
                    index,
                    "issuer",
                    e.target.value
                  )
                }
                placeholder="Issuer"
                className={`${inputClass} mb-2`}
              />

              <input
                value={certificate?.year || ""}
                onChange={(e) =>
                  updateCertificate(
                    index,
                    "year",
                    e.target.value
                  )
                }
                placeholder="Year"
                className={`${inputClass} mb-3`}
              />

              <button
                type="button"
                onClick={() => deleteCertificate(index)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete Certificate
              </button>

            </div>

          ))}

        </div>

        <button
          type="button"
          onClick={addCertificate}
          className="mt-4 w-full py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          + Add Certificate
        </button>

      </div>


      {/* =====================================
          ACHIEVEMENTS
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Achievements
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Achievements
        </h2>

        <div className="space-y-3">

          {achievements.map((achievement, index) => (

            <div
              key={index}
              className="flex gap-2"
            >

              <input
                value={achievement || ""}
                onChange={(e) =>
                  updateAchievement(
                    index,
                    e.target.value
                  )
                }
                placeholder="Achievement"
                className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  deleteAchievement(index)
                }
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

        <button
          type="button"
          onClick={addAchievement}
          className="mt-4 w-full py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          + Add Achievement
        </button>

      </div>


      {/* =====================================
          LANGUAGES
      ===================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Languages
        </p>

        <h2 className="text-lg font-semibold mt-1 mb-4">
          Manage Languages
        </h2>

        <div className="space-y-2">

          {languages.map((language, index) => (

            <div
              key={index}
              className="flex items-center gap-2"
            >

              <input
                value={language || ""}
                onChange={(e) =>
                  updateLanguage(index, e.target.value)
                }
                className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  deleteLanguage(index)
                }
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

        <div className="flex gap-2 mt-4">

          <input
            value={newLanguage}
            onChange={(e) =>
              setNewLanguage(e.target.value)
            }
            placeholder="Add a language"
            className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 outline-none focus:border-purple-500"
          />

          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default ContentEditor;