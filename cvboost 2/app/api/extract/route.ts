import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export const runtime = "nodejs";

interface ExportBody {
  title: string;
  content: string; // texte du CV (version optimisee si disponible, sinon texte brut)
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = (await req.json()) as ExportBody;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "content manquant." }, { status: 400 });
    }

    const cvTitle = title?.trim() || "Mon CV";

    // Chaque ligne non vide du texte devient un paragraphe du document Word.
    const paragraphs = content
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line.trim() })],
            spacing: { after: 120 },
          })
      );

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: cvTitle,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 240 },
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Fix : un Buffer Node.js n'est pas reconnu comme BodyInit par les types DOM.
    // On le convertit en Uint8Array, qui lui est un BodyInit valide.
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${cvTitle.replace(/[^a-z0-9-_ ]+/gi, "")}.docx"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur d'export.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
