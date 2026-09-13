import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Globe,
  Languages,
  Layers,
  Save,
  Info,
  Eye,
  Camera,
  Upload,
  Loader2,
  Target,
} from "lucide-react";

export const CAREER_TARGET_OPTIONS = [
  "Teacher / Educator",
  "Doctor / Physician",
  "Nurse / Healthcare Professional",
  "Accountant / Auditor / Financial Analyst",
  "Sales / Business Development",
  "Marketing / Content / Social Media",
  "Mechanical / Civil / Electrical Engineer",
  "Researcher / Scientist",
  "Graphic / UI/UX / Product Designer",
  "Software Developer / Data / IT",
  "Student / Fresher",
  "Banking & Finance Professional",
  "Human Resources / Recruiter",
  "Operations / Logistics / Supply Chain",
  "Legal / Compliance Professional",
  "Hospitality / Customer Service",
  "Other (Custom Role)"
];

export const DEFAULT_SKILL_CATEGORIES = [
  { key: "professional", label: "Professional & Domain Skills", placeholder: "e.g. Curriculum Planning, Patient Care, Financial Auditing, B2B Sales", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { key: "technical", label: "Technical & Specialized Skills", placeholder: "e.g. Statistical Analysis, Clinical Diagnostics, Tax Compliance, Python", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { key: "tools", label: "Tools, Software & Platforms", placeholder: "e.g. Microsoft Excel, Salesforce, Canva, EMR Systems, QuickBooks, Git", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { key: "soft", label: "Soft & Interpersonal Skills", placeholder: "e.g. Communication, Empathy, Leadership, Classroom Management, Negotiation", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { key: "industry", label: "Industry Knowledge & Regulations", placeholder: "e.g. HIPAA Compliance, GAAP, Educational Standards, Market Analysis", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
];

function CreateResume() {
  const navigate = useNavigate();
  const { resumeId: urlResumeId } = useParams();

  // -------------------------------------------------------------
  // Read Logged-In User
  // -------------------------------------------------------------
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const userCategory = storedUser?.user_category || "Student";

  // -------------------------------------------------------------
  // Form State
  // -------------------------------------------------------------
  const [careerTarget, setCareerTarget] = useState("");
  const [customCareerTarget, setCustomCareerTarget] = useState("");

  const [personal, setPersonal] = useState({
    name: storedUser?.full_name || "",
    title: "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    location: "",
    github: "",
    linkedin: "",
    portfolio_url: "",
    photo: "",
  });

  const [summary, setSummary] = useState("");

  const [education, setEducation] = useState([
    {
      degree: "",
      institution: "",
      board: "",
      location: "",
      year: "",
      score: "",
      coursework: "",
      additional_details: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      role: "",
      company: "",
      location: "",
      duration: "",
      employment_type: "Full-time",
      is_current: false,
      is_internship: false,
      description: "",
      responsibilities: "",
      achievements: "",
      highlights: [""],
      technologies: "",
    },
  ]);

  const [skills, setSkills] = useState({
    professional: [],
    technical: [],
    tools: [],
    soft: [],
    industry: [],
  });

  // Inputs for skill tags
  const [skillInputs, setSkillInputs] = useState({
    professional: "",
    technical: "",
    tools: "",
    soft: "",
    industry: "",
  });

  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [projects, setProjects] = useState([
    {
      title: "",
      subtitle: "",
      role: "",
      organization: "",
      description: "",
      responsibilities: "",
      outcomes: "",
      technologies: "",
      link: "",
      github: "",
      duration: "",
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      name: "",
      issuer: "",
      year: "",
      link: "",
    },
  ]);

  const [achievements, setAchievements] = useState([""]);

  const [languagesList, setLanguagesList] = useState([
    {
      name: "",
      level: "Professional Working",
    },
  ]);

  const [customSections, setCustomSections] = useState([]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState(null); // 'save' | 'preview' | null
  const [error, setError] = useState("");
  const [savedResumeId, setSavedResumeId] = useState(urlResumeId || null);
  const [activeTab, setActiveTab] = useState("personal");
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Profile Photo state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // AI About Generator state
  const [aboutStyle, setAboutStyle] = useState("professional");
  const [generatingAbout, setGeneratingAbout] = useState(false);
  const [aboutSuccess, setAboutSuccess] = useState("");

  const location = useLocation();
  const editData = location.state?.resumeData;
  const isEditMode = Boolean(urlResumeId || location.state?.isEdit || savedResumeId);

  // Helper to prefill form state from canonical resume object
  const populateFromResume = (data) => {
    if (!data) return;

    // Career Target
    const target = data.metadata?.career_target || data.career_target || "";
    if (target) {
      if (CAREER_TARGET_OPTIONS.includes(target)) {
        setCareerTarget(target);
      } else {
        setCareerTarget("Other (Custom Role)");
        setCustomCareerTarget(target);
      }
    }

    if (data.personal) {
      setPersonal({
        name: data.personal.name || storedUser?.full_name || "",
        title: data.personal.title || "",
        email: data.personal.email || storedUser?.email || "",
        phone: data.personal.phone || storedUser?.phone || "",
        location: data.personal.location || "",
        github: data.personal.github || "",
        linkedin: data.personal.linkedin || "",
        portfolio_url: data.personal.portfolio_url || "",
        photo: data.personal.photo || data.photo_path || data.metadata?.photo_path || "",
      });
    }

    if (data.summary || data.about) {
      setSummary(data.summary || data.about || "");
    }

    if (Array.isArray(data.education) && data.education.length > 0) {
      setEducation(
        data.education.map((e) => ({
          degree: e.degree || e.course || "",
          institution: e.institution || e.university || e.college || "",
          board: e.board || "",
          location: e.location || "",
          year: e.year || e.duration || (e.start_year && e.end_year ? `${e.start_year} - ${e.end_year}` : e.start_year || e.end_year || ""),
          score: typeof e.score === "object" ? e.score?.value || "" : e.score || e.gpa || "",
          coursework: Array.isArray(e.coursework)
            ? e.coursework.join(", ")
            : typeof e.coursework === "string"
            ? e.coursework
            : "",
          additional_details: e.additional_details || "",
        }))
      );
    }

    if (Array.isArray(data.experience) && data.experience.length > 0) {
      setExperience(
        data.experience.map((exp) => ({
          role: exp.role || exp.title || "",
          company: exp.company || exp.organization || "",
          location: exp.location || "",
          duration: exp.duration || exp.year || "",
          employment_type: exp.employment_type || (exp.is_internship ? "Internship" : "Full-time"),
          is_current: Boolean(exp.is_current),
          is_internship: Boolean(exp.is_internship || exp.employment_type === "Internship"),
          description: exp.description || "",
          responsibilities: exp.responsibilities || "",
          achievements: exp.achievements || "",
          highlights:
            Array.isArray(exp.highlights) && exp.highlights.length > 0
              ? exp.highlights
              : [""],
          technologies: Array.isArray(exp.technologies)
            ? exp.technologies.join(", ")
            : typeof exp.technologies === "string"
            ? exp.technologies
            : "",
        }))
      );
    }

    if (data.skills) {
      const s = data.skills;
      if (typeof s === "object" && !Array.isArray(s)) {
        const standardKeys = ["professional", "technical", "tools", "soft", "industry", "frameworks"];
        const loadedSkills = {
          professional: Array.isArray(s.professional) ? s.professional : [],
          technical: Array.isArray(s.technical) ? s.technical : [],
          tools: Array.isArray(s.tools) ? s.tools : [],
          soft: Array.isArray(s.soft) ? s.soft : [],
          industry: Array.isArray(s.industry) ? s.industry : [],
        };
        const loadedInputs = {
          professional: "",
          technical: "",
          tools: "",
          soft: "",
          industry: "",
        };
        const extraCats = [];

        // Legacy frameworks mapping
        if (Array.isArray(s.frameworks) && s.frameworks.length > 0) {
          loadedSkills.technical = Array.from(new Set([...loadedSkills.technical, ...s.frameworks]));
        }

        // Catch custom categories
        for (const [key, val] of Object.entries(s)) {
          if (key === "all" || standardKeys.includes(key)) continue;
          if (Array.isArray(val) && val.length > 0) {
            loadedSkills[key] = val;
            loadedInputs[key] = "";
            extraCats.push({ key, label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ") });
          }
        }
        setSkills(loadedSkills);
        setSkillInputs(loadedInputs);
        if (extraCats.length > 0) {
          setCustomCategories(extraCats);
        }
      } else if (Array.isArray(s)) {
        setSkills({
          professional: s,
          technical: [],
          tools: [],
          soft: [],
          industry: [],
        });
      }
    }

    if (Array.isArray(data.projects) && data.projects.length > 0) {
      setProjects(
        data.projects.map((p) => ({
          title: p.title || p.name || "",
          subtitle: p.subtitle || "",
          role: p.role || "",
          organization: p.organization || "",
          description: p.description || "",
          responsibilities: p.responsibilities || "",
          outcomes: p.outcomes || "",
          technologies: Array.isArray(p.technologies)
            ? p.technologies.join(", ")
            : typeof p.technologies === "string"
            ? p.technologies
            : "",
          link: p.link || p.url || "",
          github: p.github || "",
          duration: p.duration || "",
        }))
      );
    }

    if (Array.isArray(data.certificates) && data.certificates.length > 0) {
      setCertificates(
        data.certificates.map((c) => ({
          name: c.name || c.title || "",
          issuer: c.issuer || c.organization || "",
          year: c.year || "",
          link: c.link || "",
        }))
      );
    }

    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
      setAchievements(
        data.achievements.map((a) =>
          typeof a === "string" ? a : a?.title || ""
        )
      );
    }

    if (Array.isArray(data.languages) && data.languages.length > 0) {
      setLanguagesList(
        data.languages.map((l) => ({
          name: l.name || (typeof l === "string" ? l : ""),
          level: l.level || "Professional Working",
        }))
      );
    }

    if (Array.isArray(data.custom_sections) && data.custom_sections.length > 0) {
      setCustomSections(data.custom_sections);
    }
  };

  useEffect(() => {
    if (editData) {
      populateFromResume(editData);
      if (editData.resume_id) {
        setSavedResumeId(editData.resume_id);
      }
    } else if (urlResumeId) {
      setLoadingEdit(true);
      axios
        .get(`http://localhost:5000/api/resume/${urlResumeId}`)
        .then((res) => {
          if (res.data?.resume) {
            populateFromResume(res.data.resume);
            setSavedResumeId(urlResumeId);
          }
        })
        .catch((err) => {
          console.error("Failed to load resume for editing:", err);
          setError("Failed to load resume details. Please verify the resume ID.");
        })
        .finally(() => {
          setLoadingEdit(false);
        });
    }
  }, [urlResumeId, editData]);

  // Profile Photo Upload Handlers
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setPhotoError("Please select a JPEG, PNG, or WEBP image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image file size must be less than 5MB.");
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError("");
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(
        "http://localhost:5000/api/resume/upload-photo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.photo_path) {
        setPersonal((prev) => ({ ...prev, photo: res.data.photo_path }));
      }
    } catch (err) {
      console.error("Failed to upload photo:", err);
      setPhotoError(err.response?.data?.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPersonal((prev) => ({ ...prev, photo: "" }));
    setPhotoError("");
  };

  // AI About Generator Handler
  const handleGenerateAbout = async () => {
    try {
      setGeneratingAbout(true);
      setError("");
      setAboutSuccess("");

      const effectiveCareerTarget =
        careerTarget === "Other (Custom Role)"
          ? customCareerTarget.trim()
          : careerTarget.trim();

      const allSkills = Array.from(
        new Set(
          Object.values(skills).flatMap((arr) => (Array.isArray(arr) ? arr : []))
        )
      );

      const resumeDataPayload = {
        metadata: {
          career_target: effectiveCareerTarget,
        },
        personal,
        education: education.filter((e) => e.degree.trim() || e.institution.trim()),
        experience: experience.filter((exp) => exp.role.trim() || exp.company.trim()),
        projects: projects.filter((p) => p.title.trim()),
        certificates: certificates.filter((c) => c.name.trim()),
        skills: {
          ...skills,
          all: allSkills,
        },
      };

      const targetEndpoint = urlResumeId
        ? `http://localhost:5000/api/resume/${urlResumeId}/generate-about`
        : `http://localhost:5000/api/resume/generate-about`;

      const res = await axios.post(targetEndpoint, {
        style: aboutStyle,
        user_category: userCategory,
        resumeData: resumeDataPayload,
      });

      if (res.data?.about) {
        setSummary(res.data.about);
        setAboutSuccess(
          `Generated ${aboutStyle} summary (${res.data.source === "ai" ? "Gemini AI" : "Structured"}). You can edit this freely before saving!`
        );
      }
    } catch (err) {
      console.error("Failed to generate About:", err);
      setError(err.response?.data?.message || "Failed to generate About summary.");
    } finally {
      setGeneratingAbout(false);
    }
  };

  // -------------------------------------------------------------
  // Education Handlers
  // -------------------------------------------------------------
  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        degree: "",
        institution: "",
        board: "",
        location: "",
        year: "",
        score: "",
        coursework: "",
        additional_details: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Experience Handlers
  // -------------------------------------------------------------
  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        role: "",
        company: "",
        location: "",
        duration: "",
        employment_type: "Full-time",
        is_current: false,
        is_internship: false,
        description: "",
        responsibilities: "",
        achievements: "",
        highlights: [""],
        technologies: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    setExperience((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "employment_type") {
          updated.is_internship = value === "Internship";
        }
        return updated;
      })
    );
  };

  const addExperienceHighlight = (expIndex) => {
    setExperience((prev) =>
      prev.map((item, i) =>
        i === expIndex
          ? { ...item, highlights: [...item.highlights, ""] }
          : item
      )
    );
  };

  const updateExperienceHighlight = (expIndex, hIndex, value) => {
    setExperience((prev) =>
      prev.map((item, i) => {
        if (i !== expIndex) return item;
        const newHighlights = [...item.highlights];
        newHighlights[hIndex] = value;
        return { ...item, highlights: newHighlights };
      })
    );
  };

  const removeExperienceHighlight = (expIndex, hIndex) => {
    setExperience((prev) =>
      prev.map((item, i) => {
        if (i !== expIndex) return item;
        return {
          ...item,
          highlights: item.highlights.filter((_, idx) => idx !== hIndex),
        };
      })
    );
  };

  // -------------------------------------------------------------
  // Skills Handlers (Tag/Chip input + Dynamic Categories)
  // -------------------------------------------------------------
  const handleAddSkill = (category) => {
    const value = (skillInputs[category] || "").trim();
    if (!value) return;

    const currentList = skills[category] || [];
    if (currentList.includes(value)) {
      setSkillInputs((prev) => ({ ...prev, [category]: "" }));
      return;
    }

    setSkills((prev) => ({
      ...prev,
      [category]: [...currentList, value],
    }));

    setSkillInputs((prev) => ({ ...prev, [category]: "" }));
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setSkills((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddCustomCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    if (skills[key]) {
      setNewCategoryName("");
      return;
    }
    setCustomCategories((prev) => [...prev, { key, label: name }]);
    setSkills((prev) => ({ ...prev, [key]: [] }));
    setSkillInputs((prev) => ({ ...prev, [key]: "" }));
    setNewCategoryName("");
  };

  const handleRemoveCustomCategory = (key) => {
    setCustomCategories((prev) => prev.filter((c) => c.key !== key));
    setSkills((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSkillInputs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // -------------------------------------------------------------
  // Projects Handlers
  // -------------------------------------------------------------
  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        subtitle: "",
        role: "",
        organization: "",
        description: "",
        responsibilities: "",
        outcomes: "",
        technologies: "",
        link: "",
        github: "",
        duration: "",
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    setProjects((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Certifications Handlers
  // -------------------------------------------------------------
  const addCertificate = () => {
    setCertificates((prev) => [
      ...prev,
      { name: "", issuer: "", year: "", link: "" },
    ]);
  };

  const removeCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCertificate = (index, field, value) => {
    setCertificates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Achievements Handlers
  // -------------------------------------------------------------
  const addAchievement = () => {
    setAchievements((prev) => [...prev, ""]);
  };

  const removeAchievement = (index) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAchievement = (index, value) => {
    setAchievements((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  // -------------------------------------------------------------
  // Languages Handlers
  // -------------------------------------------------------------
  const addLanguage = () => {
    setLanguagesList((prev) => [
      ...prev,
      { name: "", level: "Professional Working" },
    ]);
  };

  const removeLanguage = (index) => {
    setLanguagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (index, field, value) => {
    setLanguagesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // -------------------------------------------------------------
  // Custom Sections Handlers
  // -------------------------------------------------------------
  const addCustomSection = (preset = null) => {
    if (preset && typeof preset === "object") {
      setCustomSections((prev) => [
        ...prev,
        {
          heading: preset.heading || "Additional Section",
          items: [
            {
              title: preset.itemTitle || "",
              subtitle: preset.itemSubtitle || "",
              date: "",
              description: "",
            },
          ],
        },
      ]);
      return;
    }

    setCustomSections((prev) => [
      ...prev,
      {
        heading: "",
        items: [{ title: "", subtitle: "", date: "", description: "" }],
      },
    ]);
  };

  const removeCustomSection = (index) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomSectionHeading = (index, value) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, heading: value } : sec))
    );
  };

  const addCustomSectionItem = (secIndex) => {
    setCustomSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              items: [
                ...sec.items,
                { title: "", subtitle: "", date: "", description: "" },
              ],
            }
          : sec
      )
    );
  };

  const updateCustomSectionItem = (secIndex, itemIndex, field, value) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => {
        if (i !== secIndex) return sec;
        const newItems = sec.items.map((it, idx) =>
          idx === itemIndex ? { ...it, [field]: value } : it
        );
        return { ...sec, items: newItems };
      })
    );
  };

  const removeCustomSectionItem = (secIndex, itemIndex) => {
    setCustomSections((prev) =>
      prev.map((sec, i) => {
        if (i !== secIndex) return sec;
        return {
          ...sec,
          items: sec.items.filter((_, idx) => idx !== itemIndex),
        };
      })
    );
  };

  // -------------------------------------------------------------
  // Form Submission
  // -------------------------------------------------------------
  const handleSaveResume = async (previewAfterSave = false, e = null) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (submitting) return; // Prevent double-clicks / duplicate saves
    setError("");

    if (!storedUser?.user_id) {
      setError("You must be logged in to save your resume.");
      return;
    }

    if (!personal.name.trim()) {
      setError("Full Name is required in Personal Details.");
      setActiveTab("personal");
      return;
    }

    if (!personal.email.trim()) {
      setError("Email is required in Personal Details.");
      setActiveTab("personal");
      return;
    }

    setSubmitting(true);
    setSubmitAction(previewAfterSave ? "preview" : "save");

    try {
      const effectiveCareerTarget =
        careerTarget === "Other (Custom Role)"
          ? customCareerTarget.trim()
          : careerTarget.trim();

      // Normalize skills: collect all unique skills across all categories
      const allSkills = Array.from(
        new Set(
          Object.values(skills).flatMap((arr) => (Array.isArray(arr) ? arr : []))
        )
      );

      const payload = {
        user_id: storedUser.user_id,
        user_category: userCategory,
        resumeData: {
          metadata: {
            source: "scratch",
            user_category: userCategory,
            career_target: effectiveCareerTarget,
            photo_path: personal.photo || "",
          },
          personal: {
            name: personal.name.trim(),
            title: personal.title.trim(),
            email: personal.email.trim(),
            phone: personal.phone.trim(),
            location: personal.location.trim(),
            github: personal.github.trim(),
            linkedin: personal.linkedin.trim(),
            portfolio_url: personal.portfolio_url.trim(),
            photo: personal.photo || "",
          },
          summary: summary.trim(),
          about: summary.trim(),
          education: education
            .filter((item) => item.degree.trim() || item.institution.trim())
            .map((item) => ({
              degree: item.degree.trim(),
              institution: item.institution.trim(),
              board: item.board?.trim() || "",
              location: item.location.trim(),
              year: item.year.trim(),
              score: item.score.trim(),
              coursework: item.coursework
                ? item.coursework
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
              additional_details: item.additional_details?.trim() || "",
            })),
          experience: experience
            .filter((item) => item.role.trim() || item.company.trim())
            .map((item) => ({
              role: item.role.trim(),
              company: item.company.trim(),
              location: item.location.trim(),
              duration: item.duration.trim(),
              employment_type: item.employment_type || "Full-time",
              is_current: Boolean(item.is_current),
              is_internship: Boolean(item.is_internship || item.employment_type === "Internship"),
              description: item.description.trim(),
              responsibilities: item.responsibilities?.trim() || "",
              achievements: item.achievements?.trim() || "",
              highlights: item.highlights.filter((h) => h && h.trim()),
              technologies: item.technologies
                ? item.technologies
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
            })),
          skills: {
            ...skills,
            all: allSkills,
          },
          projects: projects
            .filter((item) => item.title.trim() || item.description.trim())
            .map((item) => ({
              title: item.title.trim(),
              subtitle: item.subtitle.trim(),
              role: item.role?.trim() || "",
              organization: item.organization?.trim() || "",
              description: item.description.trim(),
              responsibilities: item.responsibilities?.trim() || "",
              outcomes: item.outcomes?.trim() || "",
              technologies: item.technologies
                ? item.technologies
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
              link: item.link.trim(),
              github: item.github.trim(),
              duration: item.duration.trim(),
            })),
          certificates: certificates
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name.trim(),
              issuer: item.issuer.trim(),
              year: item.year.trim(),
              link: item.link.trim(),
            })),
          achievements: achievements
            .map((a) => (typeof a === "string" ? a.trim() : ""))
            .filter(Boolean),
          languages: languagesList
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name.trim(),
              level: item.level.trim(),
            })),
          custom_sections: customSections
            .filter((sec) => sec.heading.trim() && sec.items.length > 0)
            .map((sec) => ({
              heading: sec.heading.trim(),
              items: sec.items
                .filter((it) => it.title.trim() || it.description.trim())
                .map((it) => ({
                  title: it.title.trim(),
                  subtitle: it.subtitle.trim(),
                  date: it.date.trim(),
                  description: it.description.trim(),
                })),
            }))
            .filter((sec) => sec.items.length > 0),
        },
      };

      let response;
      const targetId = savedResumeId || urlResumeId;

      if (targetId) {
        console.log("Updating existing resume via PUT:", targetId);
        response = await axios.put(
          `http://localhost:5000/api/resume/${targetId}`,
          payload
        );
      } else {
        console.log("Creating new resume via POST");
        response = await axios.post(
          "http://localhost:5000/api/resume/create",
          payload
        );
      }

      console.log("Resume save response:", response.data);

      const resumeId = response.data.resume_id || targetId;
      if (resumeId) {
        localStorage.setItem("resume_id", String(resumeId));
        setSavedResumeId(resumeId);

        if (previewAfterSave) {
          navigate(`/resume/preview/${resumeId}`);
          return;
        }
      } else {
        throw new Error("Resume was saved, but no resume ID was returned.");
      }
    } catch (err) {
      console.error("Error saving resume:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save resume. Please check your network and inputs."
      );
    } finally {
      setSubmitting(false);
      setSubmitAction(null);
    }
  };

  const sectionsNav = [
    { id: "personal", label: "Personal Details", icon: Globe },
    { id: "summary", label: "Summary / About", icon: Sparkles },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience / Work History", icon: Briefcase },
    { id: "skills", label: "Skills & Expertise", icon: Code2 },
    { id: "projects", label: "Projects & Professional Work", icon: FolderGit2 },
    { id: "certificates", label: "Certifications & Training", icon: Award },
    { id: "achievements", label: "Honors & Achievements", icon: Award },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "custom", label: "Additional Sections", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-3 group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {isEditMode ? "Edit Resume" : "Create Resume from Scratch"}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {userCategory} Mode
              </span>
              {savedResumeId && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  ID: #{savedResumeId}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {isEditMode
                ? "Update your resume details in place. Changes are saved to your existing record with zero duplicates."
                : "Build your structured resume. This data will power your resume templates and portfolio generator for any profession."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveResume(false)}
              disabled={submitting || loadingEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              {submitting && submitAction === "save"
                ? "Saving..."
                : isEditMode
                ? "Update Resume"
                : "Save Resume"}
            </button>
          </div>
        </div>

        {/* Auth Warning if not logged in */}
        {!storedUser && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">User Session Not Detected</p>
              <p className="text-amber-300/80 mt-1">
                You are not logged in. Your resume cannot be saved without an active account.{" "}
                <button
                  onClick={() => navigate("/auth")}
                  className="underline hover:text-amber-200 font-medium cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Success Modal / Banner */}
        {savedResumeId && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  Resume Structured Data Saved Successfully!
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  Your resume has been saved to your account in canonical schema format (Resume ID:{" "}
                  <span className="font-mono text-purple-300 font-semibold">
                    #{savedResumeId}
                  </span>
                  ). It is now ready for future stages including Resume Templates and Portfolio generation.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <button
                    onClick={() => navigate(`/resume/preview/${savedResumeId}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition cursor-pointer shadow-lg shadow-purple-600/30"
                  >
                    <Eye size={16} />
                    Preview Resume
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => setSavedResumeId(null)}
                    className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-sm transition cursor-pointer"
                  >
                    Keep Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Section Navigation Tabs + Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sticky Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/[0.03] border border-white/10 rounded-2xl p-3 space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-3 py-2">
                Resume Sections
              </p>
              {sectionsNav.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveTab(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left cursor-pointer ${
                      isActive
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-purple-400" : "text-slate-500"} />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Form Fields */}
          <div className="lg:col-span-3 space-y-8">
            {/* ========================================================
                1. PERSONAL DETAILS
            ======================================================== */}
            <section
              id="personal"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      1. Personal Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Primary contact details, profession, and online presence
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Profession / Career Track Selector */}
                <div className="md:col-span-2 pb-4 mb-2 border-b border-white/5">
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25">
                    <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-semibold">
                      <Target size={15} />
                      <span>Target Profession / Career Field:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={careerTarget}
                        onChange={(e) => setCareerTarget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#12111d] border border-white/15 text-white text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="" className="text-slate-400">Select your profession / role...</option>
                        {CAREER_TARGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#12111d] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>

                      {careerTarget === "Other (Custom Role)" && (
                        <input
                          type="text"
                          value={customCareerTarget}
                          onChange={(e) => setCustomCareerTarget(e.target.value)}
                          placeholder="Specify your field (e.g. Interior Designer, Pilot, Chef)..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Tailors AI summary phrasing, section terminology, and portfolio presentations to your chosen profession.
                    </p>
                  </div>
                </div>

                {/* Profile Photo Uploader */}
                <div className="md:col-span-2 pb-4 mb-2 border-b border-white/5">
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Profile Photo <span className="text-slate-400 font-normal">(Optional — will be displayed on modern templates)</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {personal.photo ? (
                      <div className="relative group">
                        <img
                          src={personal.photo.startsWith("http") ? personal.photo : `http://localhost:5000${personal.photo}`}
                          alt="Profile Preview"
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          title="Remove Photo"
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/[0.04] border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-400">
                        <Camera size={26} className="mb-1 text-slate-500" />
                        <span className="text-[10px]">No Photo</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30 cursor-pointer transition">
                          <Upload size={14} />
                          {personal.photo ? "Change Photo" : "Upload Photo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        {personal.photo && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports JPG, PNG, or WEBP (Max 5MB). Photo is excluded from ATS templates automatically.
                      </p>
                      {uploadingPhoto && (
                        <p className="text-xs text-purple-400 animate-pulse flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin" /> Uploading image...
                        </p>
                      )}
                      {photoError && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} /> {photoError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.name}
                    onChange={(e) =>
                      setPersonal({ ...personal, name: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Connor / John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Title / Headline
                  </label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) =>
                      setPersonal({ ...personal, title: e.target.value })
                    }
                    placeholder={
                      userCategory === "Student"
                        ? "e.g. Biology Student / Aspiring Educator / B.Com Graduate"
                        : "e.g. High School Teacher / Resident Physician / Sales Executive / Accountant"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={personal.email}
                    onChange={(e) =>
                      setPersonal({ ...personal, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personal.phone}
                    onChange={(e) =>
                      setPersonal({ ...personal, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) =>
                      setPersonal({ ...personal, location: e.target.value })
                    }
                    placeholder="City, State / Country"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    LinkedIn / Professional Network URL
                  </label>
                  <input
                    type="url"
                    value={personal.linkedin}
                    onChange={(e) =>
                      setPersonal({ ...personal, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Portfolio / Website / Professional Profile URL
                  </label>
                  <input
                    type="url"
                    value={personal.portfolio_url}
                    onChange={(e) =>
                      setPersonal({ ...personal, portfolio_url: e.target.value })
                    }
                    placeholder="https://yourprofile.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GitHub / Code Repository URL <span className="text-slate-400 font-normal">(Optional, for tech/coding roles)</span>
                  </label>
                  <input
                    type="url"
                    value={personal.github}
                    onChange={(e) =>
                      setPersonal({ ...personal, github: e.target.value })
                    }
                    placeholder="https://github.com/username (Optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* ========================================================
                2. SUMMARY / ABOUT
            ======================================================== */}
            <section
              id="summary"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      2. Professional Summary / About
                    </h2>
                    <p className="text-xs text-slate-400">
                      A concise overview of your background, strengths, and career goals
                    </p>
                  </div>
                </div>
              </div>

              {/* Contextual Guidance */}
              <div className="mb-4 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200 leading-relaxed">
                <Info size={16} className="shrink-0 mt-0.5 text-purple-300" />
                <div>
                  {userCategory === "Student" ? (
                    <span>
                      <strong>Student / Fresher:</strong> Highlight your field of study, key academic coursework, practical projects, volunteer or internship experiences, and career objectives.
                    </span>
                  ) : (
                    <span>
                      <strong>Professional:</strong> Highlight your core experience, key achievements, industry domain knowledge, leadership or collaborative strengths, and the value you bring to your organization.
                    </span>
                  )}
                </div>
              </div>

              {/* AI About Generator Toolbar */}
              <div className="mb-4 p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-purple-300 text-xs font-semibold">
                    <Sparkles size={15} />
                    <span>AI About Generator:</span>
                  </div>
                  <select
                    value={aboutStyle}
                    onChange={(e) => setAboutStyle(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="professional" className="bg-[#12111d] text-white">Professional</option>
                    <option value="simple" className="bg-[#12111d] text-white">Simple</option>
                    <option value="short" className="bg-[#12111d] text-white">Short</option>
                    <option value="technical" className="bg-[#12111d] text-white">Technical / Domain-Focused</option>
                    <option value="career-focused" className="bg-[#12111d] text-white">Career-focused</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAbout}
                    disabled={generatingAbout}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {generatingAbout ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        {summary ? "Regenerate" : "Generate with AI"}
                      </>
                    )}
                  </button>
                  {summary && (
                    <button
                      type="button"
                      onClick={() => setSummary("")}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {aboutSuccess && (
                <div className="mb-3 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                  <span>{aboutSuccess}</span>
                  <button
                    type="button"
                    onClick={() => setAboutSuccess("")}
                    className="text-emerald-400 hover:text-white ml-2 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              )}

              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={
                  userCategory === "Student"
                    ? "Motivated student with a solid academic foundation in my discipline and hands-on project experience. Eager to contribute diligence, strong communication, and problem-solving abilities..."
                    : "Accomplished professional with a proven track record of delivering measurable outcomes, managing initiatives, and collaborating across multidisciplinary teams. Seeking to leverage expertise in..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </section>

            {/* ========================================================
                3. EDUCATION
            ======================================================== */}
            <section
              id="education"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      3. Education & Academic Background
                    </h2>
                    <p className="text-xs text-slate-400">
                      Degrees, academic institutions, board/affiliation, grades, and coursework
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              <div className="space-y-5">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Education #{idx + 1}
                      </span>
                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove education"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Degree / Qualification
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(idx, "degree", e.target.value)
                          }
                          placeholder="e.g. B.Ed, MBBS, B.Com, B.S. in Biology, High School Diploma"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Institution / University / School
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(idx, "institution", e.target.value)
                          }
                          placeholder="e.g. City University / Government Medical College / Central High School"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Board / Council / Affiliation
                        </label>
                        <input
                          type="text"
                          value={edu.board}
                          onChange={(e) =>
                            updateEducation(idx, "board", e.target.value)
                          }
                          placeholder="e.g. State Board, CBSE, ICSE, University of Oxford"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Year of Completion
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) =>
                            updateEducation(idx, "year", e.target.value)
                          }
                          placeholder="e.g. 2020 - 2024 or 2023"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          GPA / Score / Grade / Percentage
                        </label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) =>
                            updateEducation(idx, "score", e.target.value)
                          }
                          placeholder="e.g. 3.85 / 4.0, 88%, or First Class with Distinction"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) =>
                            updateEducation(idx, "location", e.target.value)
                          }
                          placeholder="e.g. Boston, MA / New Delhi, India"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Relevant Coursework / Key Subjects (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={edu.coursework}
                          onChange={(e) =>
                            updateEducation(idx, "coursework", e.target.value)
                          }
                          placeholder="e.g. Cell Biology, Educational Psychology, Financial Accounting, Microeconomics"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Academic Honors / Additional Details
                        </label>
                        <input
                          type="text"
                          value={edu.additional_details}
                          onChange={(e) =>
                            updateEducation(idx, "additional_details", e.target.value)
                          }
                          placeholder="e.g. Dean's List (all semesters), Merit Scholarship recipient"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                4. EXPERIENCE / WORK HISTORY
            ======================================================== */}
            <section
              id="experience"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      4. Experience / Work History
                    </h2>
                    <p className="text-xs text-slate-400">
                      Professional employment, clinical rotations, teaching, internships, freelance, or contract work
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                          Experience #{idx + 1}
                        </span>
                        {exp.employment_type && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {exp.employment_type}
                          </span>
                        )}
                        {exp.is_current && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Current
                          </span>
                        )}
                      </div>
                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove experience"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Role / Job Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            updateExperience(idx, "role", e.target.value)
                          }
                          placeholder="e.g. High School Teacher / Resident Physician / Sales Executive / Accountant"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Organization / Company / School / Hospital
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(idx, "company", e.target.value)
                          }
                          placeholder="e.g. St. Jude High School / Memorial Hospital / Apex Corp / Deloitte"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Employment Type
                        </label>
                        <select
                          value={exp.employment_type || "Full-time"}
                          onChange={(e) =>
                            updateExperience(idx, "employment_type", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#14121f] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Contract">Contract</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Temporary">Temporary</option>
                          <option value="Self-employed">Self-employed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Period
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) =>
                            updateExperience(idx, "duration", e.target.value)
                          }
                          placeholder="e.g. Aug 2021 - Present or Jan 2023 - Dec 2023"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(idx, "location", e.target.value)
                          }
                          placeholder="e.g. Chicago, IL (or Remote / Hybrid)"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Flags: Current & Internship */}
                    <div className="flex flex-wrap items-center gap-6 mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={exp.is_internship}
                          onChange={(e) =>
                            updateExperience(idx, "is_internship", e.target.checked)
                          }
                          className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span>This is an Internship / Rotation</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={exp.is_current}
                          onChange={(e) =>
                            updateExperience(idx, "is_current", e.target.checked)
                          }
                          className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span>Currently Working Here</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Overview / Role Summary
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(idx, "description", e.target.value)
                        }
                        placeholder="Brief overview of department, team, or operational scope..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Key Responsibilities & Scope
                      </label>
                      <textarea
                        rows={2}
                        value={exp.responsibilities}
                        onChange={(e) =>
                          updateExperience(idx, "responsibilities", e.target.value)
                        }
                        placeholder="Core duties, patient care, curriculum delivery, budget management, or system design..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    {/* Bullet Highlights */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-slate-400">
                          Key Achievements & Outcomes (Bullet Points)
                        </label>
                        <button
                          type="button"
                          onClick={() => addExperienceHighlight(idx)}
                          className="text-purple-300 hover:text-purple-200 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.highlights.map((bullet, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2">
                            <span className="text-purple-400 text-xs">•</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) =>
                                updateExperienceHighlight(
                                  idx,
                                  hIdx,
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Improved student test scores by 22% through interactive laboratory exercises..."
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                            />
                            {exp.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeExperienceHighlight(idx, hIdx)
                                }
                                className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Tools, Methods & Key Skills Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={exp.technologies}
                        onChange={(e) =>
                          updateExperience(idx, "technologies", e.target.value)
                        }
                        placeholder="e.g. Google Classroom, Lesson Planning, EMR/EHR, QuickBooks, CRM, Excel, Agile, React"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                5. SKILLS & EXPERTISE
            ======================================================== */}
            <section
              id="skills"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      5. Skills & Expertise
                    </h2>
                    <p className="text-xs text-slate-400">
                      Organized by domain, technical, tools, and soft skills (interactive tags for any profession)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ...DEFAULT_SKILL_CATEGORIES,
                  ...customCategories.map((c) => ({
                    key: c.key,
                    label: c.label,
                    placeholder: `Add ${c.label}...`,
                    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                    isCustom: true,
                  })),
                ].map((cat) => (
                  <div
                    key={cat.key}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-slate-300">
                            {cat.label}
                          </label>
                          {cat.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomCategory(cat.key)}
                              className="text-slate-500 hover:text-red-400 text-xs transition cursor-pointer"
                              title="Delete this custom category"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {(skills[cat.key] || []).length} added
                        </span>
                      </div>

                      {/* Tag Input */}
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={skillInputs[cat.key] || ""}
                          onChange={(e) =>
                            setSkillInputs({
                              ...skillInputs,
                              [cat.key]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill(cat.key);
                            }
                          }}
                          placeholder={cat.placeholder}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSkill(cat.key)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {/* Chips Container */}
                      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-black/20 border border-white/5">
                        {!(skills[cat.key] && skills[cat.key].length > 0) ? (
                          <span className="text-xs text-slate-500 italic">
                            No skills added yet
                          </span>
                        ) : (
                          skills[cat.key].map((sk, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${cat.badgeColor}`}
                            >
                              <span>{sk}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(cat.key, sk)}
                                className="hover:text-red-400 transition cursor-pointer font-bold leading-none"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Skill Category Bar */}
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-purple-300 mb-1">
                    Need a custom category for your profession?
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    placeholder="e.g. Clinical Competencies, Laboratory Techniques, Pedagogical Methods..."
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="w-full sm:w-auto px-4 py-2 mt-auto rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer self-end"
                >
                  + Add Category
                </button>
              </div>
            </section>

            {/* ========================================================
                6. PROJECTS & PROFESSIONAL WORK
            ======================================================== */}
            <section
              id="projects"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <FolderGit2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      6. Projects & Professional Work
                    </h2>
                    <p className="text-xs text-slate-400">
                      Initiatives, case studies, research, curriculum design, campaigns, or technical builds
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Project / Work
                </button>
              </div>

              <div className="space-y-6">
                {projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Project / Initiative #{idx + 1}
                      </span>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Project / Initiative Title
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) =>
                            updateProject(idx, "title", e.target.value)
                          }
                          placeholder="e.g. Biology Lab Inquiry Redesign / Q3 B2B Inbound Strategy / Smart Resume Analyzer"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Role / Contribution
                        </label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) =>
                            updateProject(idx, "role", e.target.value)
                          }
                          placeholder="e.g. Lead Educator / Campaign Strategist / Clinical Investigator / Lead Developer"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Organization / Context / Subtitle
                        </label>
                        <input
                          type="text"
                          value={proj.subtitle}
                          onChange={(e) =>
                            updateProject(idx, "subtitle", e.target.value)
                          }
                          placeholder="e.g. School Curriculum Committee / Acme Corp Client Project / Academic Capstone"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Duration / Date
                        </label>
                        <input
                          type="text"
                          value={proj.duration}
                          onChange={(e) =>
                            updateProject(idx, "duration", e.target.value)
                          }
                          placeholder="e.g. Jan 2024 - Apr 2024"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Live Demo / Publication / Reference URL
                        </label>
                        <input
                          type="url"
                          value={proj.link}
                          onChange={(e) =>
                            updateProject(idx, "link", e.target.value)
                          }
                          placeholder="https://example.com/project-or-paper (Optional)"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Repository / Resource URL <span className="text-slate-400 font-normal">(Optional, for tech roles)</span>
                        </label>
                        <input
                          type="url"
                          value={proj.github}
                          onChange={(e) =>
                            updateProject(idx, "github", e.target.value)
                          }
                          placeholder="https://github.com/user/project (Optional)"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Overview & Objectives
                      </label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(idx, "description", e.target.value)
                        }
                        placeholder="Describe the initiative's purpose, background context, and problem addressed..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Key Responsibilities / Deliverables
                      </label>
                      <textarea
                        rows={2}
                        value={proj.responsibilities}
                        onChange={(e) =>
                          updateProject(idx, "responsibilities", e.target.value)
                        }
                        placeholder="Specific tasks, methodologies, analyses, clinical protocols, or code delivered..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Key Outcomes / Results & Impact
                      </label>
                      <textarea
                        rows={2}
                        value={proj.outcomes}
                        onChange={(e) =>
                          updateProject(idx, "outcomes", e.target.value)
                        }
                        placeholder="e.g. Comprehension rate increased by 22%, generated $140k in pipeline, adopted hospital-wide..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Tools, Skills & Methodologies Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) =>
                          updateProject(idx, "technologies", e.target.value)
                        }
                        placeholder="e.g. Statistical Analysis, SPSS, Inquiry-Based Learning, Google Workspace, Excel, React"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                7. CERTIFICATIONS & LICENSES
            ======================================================== */}
            <section
              id="certificates"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      7. Certifications, Licenses & Training
                    </h2>
                    <p className="text-xs text-slate-400">
                      Professional credentials, state licenses, board certifications, and courses
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCertificate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group hover:border-white/15 transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
                        Certification #{idx + 1}
                      </span>
                      {certificates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertificate(idx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove certification"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Certification / License Name
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                            updateCertificate(idx, "name", e.target.value)
                          }
                          placeholder="e.g. State Teaching License / ACLS Certification / CPA / PMP"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Issuing Organization / Authority
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertificate(idx, "issuer", e.target.value)
                          }
                          placeholder="e.g. State Board of Education / American Heart Association / AICPA"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Year / Issue Date
                        </label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) =>
                            updateCertificate(idx, "year", e.target.value)
                          }
                          placeholder="e.g. 2023 or Valid through 2026"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Credential Link / Verification URL
                        </label>
                        <input
                          type="url"
                          value={cert.link}
                          onChange={(e) =>
                            updateCertificate(idx, "link", e.target.value)
                          }
                          placeholder="https://credential.net/your-license (Optional)"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                8. ACHIEVEMENTS & AWARDS
            ======================================================== */}
            <section
              id="achievements"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      8. Honors & Achievements
                    </h2>
                    <p className="text-xs text-slate-400">
                      Academic honors, teaching recognition, quota accomplishments, or publications
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addAchievement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Achievement
                </button>
              </div>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-purple-400 text-sm font-bold">#{idx + 1}</span>
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      placeholder="e.g. Teacher of the Year 2023 / Exceeded annual sales quota by 140% / Published clinical paper in peer-reviewed journal"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                    {achievements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAchievement(idx)}
                        className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                9. LANGUAGES
            ======================================================== */}
            <section
              id="languages"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Languages size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      9. Languages
                    </h2>
                    <p className="text-xs text-slate-400">
                      Spoken and written language proficiency
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addLanguage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Language
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languagesList.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(idx, "name", e.target.value)
                        }
                        placeholder="e.g. English, Spanish, Hindi"
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                      />
                      <select
                        value={lang.level}
                        onChange={(e) =>
                          updateLanguage(idx, "level", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#14121f] border border-white/10 text-slate-300 text-xs focus:border-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Native / Bilingual">Native / Bilingual</option>
                        <option value="Full Professional / Fluent">Full Professional / Fluent</option>
                        <option value="Professional Working">Professional Working</option>
                        <option value="Limited Working / Intermediate">Limited Working / Intermediate</option>
                        <option value="Elementary / Basic">Elementary / Basic</option>
                      </select>
                    </div>

                    {languagesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(idx)}
                        className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                10. ADDITIONAL / CUSTOM SECTIONS
            ======================================================== */}
            <section
              id="custom"
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      10. Additional / Custom Sections
                    </h2>
                    <p className="text-xs text-slate-400">
                      Add custom sections such as Publications, Clinical Rotations, Volunteer Work, or Leadership
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addCustomSection()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Plus size={14} /> Add Blank Section
                </button>
              </div>

              {/* Quick Preset Buttons for Custom Sections */}
              <div className="mb-6 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-300 mb-2.5">
                  1-Click Presets for your profession:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { heading: "Publications & Research", itemTitle: "Research Paper / Article", itemSubtitle: "Journal / Conference" },
                    { heading: "Clinical Rotations & Experience", itemTitle: "Clinical Specialty / Ward", itemSubtitle: "Hospital / Healthcare Facility" },
                    { heading: "Teaching & Mentorship Experience", itemTitle: "Course / Workshop", itemSubtitle: "School / Institution" },
                    { heading: "Volunteer & Community Service", itemTitle: "Volunteer Role", itemSubtitle: "Nonprofit / Community Organization" },
                    { heading: "Key Campaigns & Initiatives", itemTitle: "Campaign / Project Name", itemSubtitle: "Client / Organization" },
                    { heading: "Conferences & Presentations", itemTitle: "Presentation / Speech", itemSubtitle: "Conference / Event" },
                    { heading: "Professional Memberships & Affiliations", itemTitle: "Member / Board Member", itemSubtitle: "Professional Society / Association" },
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => addCustomSection(preset)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/30 text-xs transition cursor-pointer"
                    >
                      + {preset.heading}
                    </button>
                  ))}
                </div>
              </div>

              {customSections.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-slate-500 text-sm">
                    No custom sections added yet. Click "+ Add Custom Section" above to add sections like Publications, Volunteer Work, or Leadership.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {customSections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-purple-500/20 relative"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 mr-4">
                          <label className="block text-xs font-medium text-purple-300 mb-1">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) =>
                              updateCustomSectionHeading(sIdx, e.target.value)
                            }
                            placeholder="e.g. Volunteer Experience or Publications"
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-semibold text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCustomSection(sIdx)}
                          className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove entire section"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Items in this custom section */}
                      <div className="space-y-4 pl-2 border-l-2 border-purple-500/30">
                        {sec.items.map((it, iIdx) => (
                          <div
                            key={iIdx}
                            className="p-3.5 rounded-lg bg-black/20 border border-white/5 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-medium">
                                Item #{iIdx + 1}
                              </span>
                              {sec.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeCustomSectionItem(sIdx, iIdx)
                                  }
                                  className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={it.title}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Item Title / Role"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />

                              <input
                                type="text"
                                value={it.subtitle}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                                placeholder="Organization / Subtitle"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />

                              <input
                                type="text"
                                value={it.date}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    sIdx,
                                    iIdx,
                                    "date",
                                    e.target.value
                                  )
                                }
                                placeholder="Date / Period"
                                className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                              />
                            </div>

                            <textarea
                              rows={2}
                              value={it.description}
                              onChange={(e) =>
                                updateCustomSectionItem(
                                  sIdx,
                                  iIdx,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description or bullet notes..."
                              className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addCustomSectionItem(sIdx)}
                          className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus size={12} /> Add Item to this section
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bottom Save Bar */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Ready to save your resume?
                </p>
                <p className="text-xs text-slate-400">
                  You can save your progress or immediately preview your structured resume.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveResume(false)}
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition border border-white/10 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={16} />
                  {submitting && submitAction === "save"
                    ? isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Resume"
                    : "Save Resume"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveResume(true)}
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer"
                >
                  <Eye size={16} />
                  {submitting && submitAction === "preview"
                    ? isEditMode
                      ? "Updating & Previewing..."
                      : "Saving & Previewing..."
                    : isEditMode
                    ? "Update & Preview"
                    : "Save & Preview"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateResume;
