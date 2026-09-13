import React from "react";
import { GripVertical, Eye, EyeOff } from "lucide-react";

function SectionOrganizer({ sections, setSections }) {
  const sectionNames = {
    about: "About",
    experience: "Experience / Work History",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certificates: "Certificates",
    achievements: "Achievements",
    languages: "Languages",
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];

    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newSections.length) {
      return;
    }

    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];

    setSections(newSections);
  };

  const toggleSection = (section) => {
    if (sections.includes(section)) {
      setSections(
        sections.filter((item) => item !== section)
      );
    } else {
      setSections([...sections, section]);
    }
  };

  const allSections = Object.keys(sectionNames);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Layout
        </p>

        <h2 className="text-lg font-semibold mt-1">
          Arrange Sections
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Change the order or hide sections from your portfolio.
        </p>
      </div>

      <div className="space-y-2">

        {allSections.map((section) => {
          const index = sections.indexOf(section);
          const visible = index !== -1;

          return (
            <div
              key={section}
              className={`rounded-xl border p-3 transition ${
                visible
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-white/5 bg-black/10 opacity-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <GripVertical
                  size={18}
                  className="text-gray-600"
                />

                <span className="flex-1 text-sm font-medium">
                  {sectionNames[section]}
                </span>

                {/* Move buttons */}
                {visible && (
                  <div className="flex gap-1">

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveSection(index, "up")
                      }
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"
                      title="Move up"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === sections.length - 1
                      }
                      onClick={() =>
                        moveSection(index, "down")
                      }
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"
                      title="Move down"
                    >
                      ↓
                    </button>

                  </div>
                )}

                {/* Visibility */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(section)
                  }
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                  title={
                    visible
                      ? "Hide section"
                      : "Show section"
                  }
                >
                  {visible ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default SectionOrganizer;