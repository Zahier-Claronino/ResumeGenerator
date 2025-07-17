let resumeHTMLs = ["", "", ""];

    function addListItem(inputId, containerId, listClass) {
      const input = document.getElementById(inputId);
      const container = document.getElementById(containerId);
      const userInput = input.value.trim();

      if (userInput) {
        const wrapper = document.createElement("div");
        wrapper.className = `listItem ${listClass}`;

        const paragraph = document.createElement("p");
        paragraph.textContent = userInput;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.className = "removeBtn";
        removeBtn.addEventListener("click", () => wrapper.remove());

        wrapper.appendChild(paragraph);
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);

        input.value = "";
      }
    }

    document.getElementById("addExperienceBtn").addEventListener("click", () =>
      addListItem("experienceInput", "store-experience", "experienceList")
    );
    document.getElementById("addEducationBtn").addEventListener("click", () =>
      addListItem("educationInput", "store-education", "educationList")
    );
    document.getElementById("addSkillsBtn").addEventListener("click", () =>
      addListItem("skillsInput", "store-skills", "skillsList")
    );
    document.getElementById("addCertificationsBtn").addEventListener("click", () =>
      addListItem("certificationsInput", "store-certifications", "certificationsList")
    );

    async function fetchResumeTemplate(prompt) {
      const url = `https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Pollinations API error");
      return await res.text();
    }

    function buildPrompt(data, styleHint) {
      return `
Create a stylish, modern, and responsive 1-page resume template in HTML and CSS (inside <style> tags only).
Use this visual style hint: ${styleHint}.
It should include:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}
LinkedIn: ${data.linkedin}
GitHub: ${data.github}
Professional Summary: ${data.summary}
Experience: ${data.experience.join(" | ")}
Education: ${data.education.join(" | ")}
Skills: ${data.skills.join(", ")}
Certifications: ${data.certifications.join(", ")}

Use creative layout and typography. This resume will be shown in an iframe, so keep styling internal.
Return only valid HTML code with embedded CSS.
-comment out any code that displays in the iframe.!important
      `;
    }

    async function generateCV() {
  const btn = document.getElementById("generateBtn");
  btn.classList.add("animating"); // Add animation class

  const data = {
    name: document.querySelector('input[name="full_name"]').value,
    email: document.querySelector('input[name="email"]').value,
    phone: document.querySelector('input[name="phone"]').value,
    location: document.querySelector('input[name="location"]').value,
    linkedin: document.querySelector('input[name="linkedin"]').value,
    github: document.querySelector('input[name="github"]').value,
    summary: document.querySelector('textarea[name="summary"]').value,
    experience: Array.from(document.querySelectorAll("#store-experience .listItem p")).map(el => el.textContent),
    education: Array.from(document.querySelectorAll("#store-education .listItem p")).map(el => el.textContent),
    skills: Array.from(document.querySelectorAll("#store-skills .listItem p")).map(el => el.textContent),
    certifications: Array.from(document.querySelectorAll("#store-certifications .listItem p")).map(el => el.textContent),
  };

  const styles = [
    "Clean and professional with a soft blue/lightblue/black/white/purple/gray/SILVER/WHITESMOKEtheme",
    "Bold and creative with bright accent colors",
    "Minimalist and elegant with lots of whitespace"
  ];

  const iframes = [
    document.getElementById("codePreview1"),
    document.getElementById("codePreview2"),
    document.getElementById("codePreview3")
  ];

  for (let i = 0; i < styles.length; i++) {
    const prompt = buildPrompt(data, styles[i]);
    try {
      const html = await fetchResumeTemplate(prompt);
      const cleanedHTML = html.replace(/^```html\s*/i, '').replace(/```$/, '');
      iframes[i].srcdoc = cleanedHTML;
      iframes[i].style.height = "1100px";
      resumeHTMLs[i] = cleanedHTML;
      if(i === 0){
        const preview = document.getElementById("cv-preview");
        preview.scrollIntoView({ behavior: "smooth" });
      }
      
    } catch (err) {
      alert(`Failed to generate resume template ${i + 1}: ` + err.message);
    }
  }

  btn.classList.remove("animating"); // Remove animation class after generating
  
}

    document.getElementById("generateBtn").addEventListener("click", generateCV);

    function downloadResume(index, type = "docx") {
      const html = resumeHTMLs[index];
      if (!html) return alert(`Please generate Preview ${index + 1} first!`);
      const blob = new Blob([html], { type: "text/html" });
      const filename = `resume${index + 1}.${type === "docx" ? "docx" : "odf"}`;
      saveAs(blob, filename);
    }

    [1, 2, 3].forEach(i => {
      document.getElementById(`downloadOdfBtn${i}`).addEventListener("click", () => downloadResume(i - 1, "odf"));
    });

  const h1 = document.getElementById("wavyText");
  const letters = h1.textContent.split("");
  h1.innerHTML = letters
    .map((char, i) => `<span style="animation-delay:${i * 0.1}s">${char}</span>`)
    .join(" ");

