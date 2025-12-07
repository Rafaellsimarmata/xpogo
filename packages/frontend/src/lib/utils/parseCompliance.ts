export type DocumentRequirement = {
  id: string;
  title: string;
  description: string;
  status: "complete" | "pending" | "in-progress";
  level: "basic" | "advanced";
  actionLabel?: string;
};

export const parseComplianceChecklist = (
  content: string
): DocumentRequirement[] => {
  const documents: DocumentRequirement[] = [];
  
  const blocks = content.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  
  let index = 0;

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    
    if (lines.length === 0) continue;

    let title = lines[0];
    
    title = title
      .replace(/^\[.*?\]\s*/, "") 
      .replace(/^[-*•]\s+/, "") 
      .replace(/^\d+\.\s*/, "") 
      .trim();

    if (title.length < 3 || title.length > 100) continue;
    if (title.match(/^#{1,3}\s+/)) continue; 

    const descriptionLines = lines.slice(1).filter(line => {
      return !line.match(/^\[.*?\]/) && 
             !line.match(/^[-*•]\s+/) && 
             !line.match(/^\d+\.\s+/) &&
             line.length > 10; 
    });

    const description = descriptionLines.length > 0
      ? descriptionLines.join(" ")
      : `Dokumen yang diperlukan: ${title}`;

    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50) || `doc-${index}`;

    const level = title.toLowerCase().includes("sertifikat") ||
      title.toLowerCase().includes("certificate") ||
      title.toLowerCase().includes("registration") ||
      title.toLowerCase().includes("iso") ||
      title.toLowerCase().includes("fda") ||
      title.toLowerCase().includes("ce") ||
      title.toLowerCase().includes("halal")
      ? "advanced"
      : "basic";

    documents.push({
      id: `${id}-${index}`,
      title,
      description,
      status: "pending",
      level,
    });

    index++;
  }

  if (documents.length === 0) {
    const allLines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    let currentTitle = "";
    let currentDescription = "";

    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      
      if (!line || line.match(/^#{1,3}\s+/)) continue;

      const isTitle = line.length < 100 && 
        !line.match(/^\[.*?\]/) &&
        !line.match(/^[-*•]\s+/) &&
        !line.match(/^\d+\.\s+/) &&
        (i === 0 || allLines[i - 1] === "");

      if (isTitle && !currentTitle) {
        currentTitle = line.replace(/^\[.*?\]\s*/, "").trim();
      } else if (currentTitle && line.length > 10) {
        if (currentDescription) {
          currentDescription += " " + line;
        } else {
          currentDescription = line;
        }
      } else if (currentTitle && line === "" && currentDescription) {
        const id = currentTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 50) || `doc-${index}`;

        documents.push({
          id: `${id}-${index}`,
          title: currentTitle,
          description: currentDescription,
          status: "pending",
          level: currentTitle.toLowerCase().includes("sertifikat") ||
            currentTitle.toLowerCase().includes("certificate") ||
            currentTitle.toLowerCase().includes("registration")
            ? "advanced"
            : "basic",
        });

        currentTitle = "";
        currentDescription = "";
        index++;
      }
    }

    if (currentTitle && currentDescription) {
      const id = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50) || `doc-${index}`;

      documents.push({
        id: `${id}-${index}`,
        title: currentTitle,
        description: currentDescription,
        status: "pending",
        level: "basic",
      });
    }
  }

  return documents;
};

export const checklistCompletion = (items: DocumentRequirement[]): number => {
  if (!items.length) return 0;
  const completed = items.filter((item) => item.status === "complete").length;
  return Math.round((completed / items.length) * 100);
};

