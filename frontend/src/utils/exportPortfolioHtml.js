/**
 * Generates and triggers download of a standalone, self-contained portfolio.html file.
 * The exported HTML includes responsive styles, candidate data, and selected template aesthetics
 * so it can be viewed offline or deployed independently anywhere.
 */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function exportPortfolioToHtml(portfolio, options = {}) {
  if (!portfolio) return;

  const personal = portfolio.personal || {};
  const name = personal.name || "Portfolio";
  const title = personal.title || "";
  const email = personal.email || "";
  const phone = personal.phone || "";
  const location = personal.location || "";
  const website = personal.portfolio_url || "";
  const linkedin = personal.linkedin || "";
  const github = personal.github || "";
  const photo = options.photo || portfolio.photo_path || personal.photo || null;
  const template = options.template || portfolio.template_name || "professional";
  const theme = options.theme || portfolio.theme || (template === "dark" ? "dark" : "light");
  const isDark = theme === "dark";

  const about = portfolio.about || portfolio.summary || "";
  const experience = Array.isArray(portfolio.experience) ? portfolio.experience : [];
  const education = Array.isArray(portfolio.education) ? portfolio.education : [];
  const rawSkills = portfolio.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : (rawSkills?.all || Object.values(rawSkills || {}).flat().filter(Boolean));
  const projects = Array.isArray(portfolio.projects) ? portfolio.projects : [];
  const certificates = Array.isArray(portfolio.certificates || portfolio.certifications)
    ? (portfolio.certificates || portfolio.certifications)
    : [];
  const achievements = Array.isArray(portfolio.achievements) ? portfolio.achievements : [];
  const languages = Array.isArray(portfolio.languages) ? portfolio.languages : [];
  const customSections = Array.isArray(portfolio.custom_sections) ? portfolio.custom_sections : [];

  // Theme palettes based on template
  let bgClass = isDark ? "bg-[#0b1320] text-[#edf2f7]" : "bg-[#f8f9fa] text-[#172033]";
  let cardClass = isDark ? "bg-[#172131] border-[#2b3a4e]" : "bg-white border-[#e2e8f0]";
  let accentColor = isDark ? "#8fb7df" : "#315b87";
  let fontClass = "font-sans";

  if (template === "minimal") {
    bgClass = isDark ? "bg-[#171614] text-[#f1eee7]" : "bg-[#f8f6f1] text-[#242321]";
    cardClass = isDark ? "bg-[#22201d] border-[#393731]" : "bg-white border-[#e5e0d8]";
    accentColor = isDark ? "#d7b98a" : "#856b43";
    fontClass = "font-serif";
  } else if (template === "dark") {
    bgClass = "bg-[#0d0f17] text-[#e2e8f0]";
    cardClass = "bg-[#161a29] border-[#242c42]";
    accentColor = "#a78bfa";
  } else if (template === "aesthetic") {
    bgClass = isDark ? "bg-[#18111e] text-[#fce7f3]" : "bg-[#faf5f7] text-[#2d1b28]";
    cardClass = isDark ? "bg-[#251b2e] border-[#4a2e47]" : "bg-white border-[#f3dbe5]";
    accentColor = "#db2777";
  } else if (template === "tech") {
    bgClass = isDark ? "bg-[#061412] text-[#e6f4f1]" : "bg-[#f0fdfa] text-[#134e48]";
    cardClass = isDark ? "bg-[#0c2421] border-[#164e47]" : "bg-white border-[#ccfbf1]";
    accentColor = "#0d9488";
    fontClass = "font-mono";
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en" class="${isDark ? "dark" : ""}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} — Professional Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: ${template === "minimal" ? "'Playfair Display', Georgia, serif" : (template === "tech" ? "'JetBrains Mono', monospace" : "'Inter', system-ui, sans-serif")};
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="${bgClass} min-h-screen transition-colors duration-200">
  <!-- Header / Navigation -->
  <header class="sticky top-0 z-40 backdrop-blur-md bg-opacity-80 border-b border-opacity-10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
    <div class="font-bold text-lg tracking-tight">${escapeHtml(name)}</div>
    <nav class="hidden md:flex items-center gap-6 text-xs font-medium opacity-80">
      ${about ? '<a href="#about" class="hover:opacity-100 transition">About</a>' : ''}
      ${experience.length ? '<a href="#experience" class="hover:opacity-100 transition">Experience</a>' : ''}
      ${education.length ? '<a href="#education" class="hover:opacity-100 transition">Education</a>' : ''}
      ${skills.length ? '<a href="#skills" class="hover:opacity-100 transition">Skills</a>' : ''}
      ${projects.length ? '<a href="#projects" class="hover:opacity-100 transition">Work</a>' : ''}
      ${certificates.length ? '<a href="#certificates" class="hover:opacity-100 transition">Certificates</a>' : ''}
    </nav>
  </header>

  <!-- Hero Section -->
  <main class="max-w-4xl mx-auto px-6 py-16 space-y-20">
    <section class="flex flex-col md:flex-row items-center gap-10">
      ${photo ? `
      <div class="shrink-0">
        <img src="${escapeHtml(photo)}" alt="${escapeHtml(name)}" class="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover shadow-2xl border-4 border-opacity-20" style="border-color: ${accentColor};" />
      </div>` : ''}
      <div class="space-y-4 text-center md:text-left flex-1">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">${escapeHtml(name)}</h1>
        ${title ? `<p class="text-xl md:text-2xl font-medium opacity-90" style="color: ${accentColor};">${escapeHtml(title)}</p>` : ''}
        ${location ? `<p class="text-sm opacity-70">📍 ${escapeHtml(location)}</p>` : ''}
        
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
          ${email ? `<a href="mailto:${escapeHtml(email)}" class="px-3.5 py-1.5 rounded-full border border-opacity-20 hover:border-opacity-60 transition" style="border-color: ${accentColor};">✉️ ${escapeHtml(email)}</a>` : ''}
          ${phone ? `<a href="tel:${escapeHtml(phone)}" class="px-3.5 py-1.5 rounded-full border border-opacity-20 hover:border-opacity-60 transition" style="border-color: ${accentColor};">📞 ${escapeHtml(phone)}</a>` : ''}
          ${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-full border border-opacity-20 hover:border-opacity-60 transition" style="border-color: ${accentColor};">🌐 Website</a>` : ''}
          ${linkedin ? `<a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-full border border-opacity-20 hover:border-opacity-60 transition" style="border-color: ${accentColor};">💼 LinkedIn</a>` : ''}
          ${github ? `<a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-full border border-opacity-20 hover:border-opacity-60 transition" style="border-color: ${accentColor};">🐙 GitHub</a>` : ''}
        </div>
      </div>
    </section>

    <!-- About Section -->
    ${about ? `
    <section id="about" class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">About</h2>
      <p class="text-base md:text-lg leading-relaxed opacity-85">${escapeHtml(about)}</p>
    </section>` : ''}

    <!-- Experience Section -->
    ${experience.length ? `
    <section id="experience" class="space-y-6">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Experience & Work History</h2>
      <div class="space-y-6">
        ${experience.map((exp) => `
        <div class="p-6 rounded-2xl border ${cardClass} space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h3 class="text-lg font-bold">${escapeHtml(exp.role || exp.title || "Role")}</h3>
              <p class="text-sm font-semibold" style="color: ${accentColor};">${escapeHtml(exp.company || exp.organization || "")}</p>
            </div>
            <div class="text-xs opacity-70 sm:text-right">
              <span>${escapeHtml(exp.duration || exp.year || "")}</span>
              ${exp.location ? `<span> • ${escapeHtml(exp.location)}</span>` : ''}
              ${exp.is_internship ? `<span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-500">Internship</span>` : ''}
            </div>
          </div>
          ${exp.description ? `<p class="text-sm leading-relaxed opacity-80">${escapeHtml(exp.description)}</p>` : ''}
          ${Array.isArray(exp.highlights) && exp.highlights.filter(Boolean).length ? `
          <ul class="list-disc list-inside text-xs opacity-80 space-y-1">
            ${exp.highlights.filter(Boolean).map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>` : ''}
          ${Array.isArray(exp.technologies) && exp.technologies.filter(Boolean).length ? `
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${exp.technologies.filter(Boolean).map((t) => `<span class="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 font-medium">${escapeHtml(t)}</span>`).join("")}
          </div>` : ''}
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Education Section -->
    ${education.length ? `
    <section id="education" class="space-y-6">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Education</h2>
      <div class="space-y-4">
        ${education.map((edu) => `
        <div class="p-5 rounded-xl border ${cardClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-bold text-base">${escapeHtml(edu.degree || edu.course || "Degree")}</h3>
            <p class="text-sm opacity-80">${escapeHtml(edu.institution || edu.university || "")}</p>
            ${edu.score ? `<span class="inline-block mt-1 text-xs font-semibold" style="color: ${accentColor};">${escapeHtml(typeof edu.score === "object" ? `${edu.score.label || "Score"}: ${edu.score.value}` : String(edu.score))}</span>` : ''}
          </div>
          <div class="text-xs opacity-70 sm:text-right">
            <span>${escapeHtml(edu.year || "")}</span>
            ${edu.location ? `<p>${escapeHtml(edu.location)}</p>` : ''}
          </div>
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Skills Section -->
    ${skills.length ? `
    <section id="skills" class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Skills & Competencies</h2>
      <div class="flex flex-wrap gap-2">
        ${skills.map((s) => `
        <span class="px-3.5 py-1.5 rounded-xl border ${cardClass} text-xs font-medium shadow-sm">
          ${escapeHtml(typeof s === "string" ? s : (s?.name || String(s)))}
        </span>`).join("")}
      </div>
    </section>` : ''}

    <!-- Projects Section -->
    ${projects.length ? `
    <section id="projects" class="space-y-6">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Projects & Selected Work</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${projects.map((prj) => `
        <div class="p-5 rounded-2xl border ${cardClass} space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <h3 class="font-bold text-base">${escapeHtml(prj.title || prj.name || "Project")}</h3>
            ${prj.subtitle ? `<p class="text-xs font-medium" style="color: ${accentColor};">${escapeHtml(prj.subtitle)}</p>` : ''}
            ${prj.description ? `<p class="text-xs leading-relaxed opacity-80">${escapeHtml(prj.description)}</p>` : ''}
          </div>
          ${prj.link || prj.github ? `
          <div class="flex items-center gap-3 pt-2 text-xs">
            ${prj.link ? `<a href="${escapeHtml(prj.link)}" target="_blank" rel="noopener noreferrer" class="font-semibold underline" style="color: ${accentColor};">View Project →</a>` : ''}
            ${prj.github ? `<a href="${escapeHtml(prj.github)}" target="_blank" rel="noopener noreferrer" class="opacity-70 hover:opacity-100">Repository</a>` : ''}
          </div>` : ''}
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Certificates Section -->
    ${certificates.length ? `
    <section id="certificates" class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Certifications & Credentials</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${certificates.map((cert) => `
        <div class="p-4 rounded-xl border ${cardClass} space-y-1">
          <h3 class="font-bold text-sm">${escapeHtml(cert.name || cert.title || "")}</h3>
          ${cert.issuer ? `<p class="text-xs opacity-70">${escapeHtml(cert.issuer)}</p>` : ''}
          ${cert.year ? `<p class="text-[11px] opacity-60">${escapeHtml(cert.year)}</p>` : ''}
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Achievements Section -->
    ${achievements.length ? `
    <section id="achievements" class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Achievements & Honors</h2>
      <div class="space-y-3">
        ${achievements.map((ach) => `
        <div class="p-4 rounded-xl border ${cardClass} space-y-1">
          <h3 class="font-semibold text-sm">${escapeHtml(ach.title || "")}</h3>
          ${ach.description ? `<p class="text-xs opacity-80 leading-relaxed">${escapeHtml(ach.description)}</p>` : ''}
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Languages Section -->
    ${languages.length ? `
    <section id="languages" class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">Languages</h2>
      <div class="flex flex-wrap gap-3">
        ${languages.map((lang) => `
        <div class="px-4 py-2 rounded-xl border ${cardClass} text-xs">
          <span class="font-semibold">${escapeHtml(lang.language || lang.name || "")}</span>
          <span class="opacity-70 ml-1.5">• ${escapeHtml(lang.proficiency || lang.level || "Proficient")}</span>
        </div>`).join("")}
      </div>
    </section>` : ''}

    <!-- Custom Sections -->
    ${customSections.map((sec) => `
    <section class="space-y-4">
      <h2 class="text-2xl font-bold border-b pb-2 border-opacity-10">${escapeHtml(sec.heading || "Additional Information")}</h2>
      <div class="space-y-3">
        ${(Array.isArray(sec.items) ? sec.items : []).map((item) => `
        <div class="p-4 rounded-xl border ${cardClass} text-xs opacity-85 leading-relaxed">
          ${escapeHtml(typeof item === "object" ? (item.description || item.title || JSON.stringify(item)) : String(item))}
        </div>`).join("")}
      </div>
    </section>`).join("")}
  </main>

  <footer class="max-w-4xl mx-auto px-6 py-12 text-center text-xs opacity-50 border-t border-opacity-10 mt-20">
    <p>Generated by SmartResumeAnalyzer • ${escapeHtml(name)}'s Portfolio</p>
  </footer>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "portfolio.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
