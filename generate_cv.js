import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';

// Design theme configurations
const THEMES = {
  technical: {
    font: 'Arial',
    primaryColor: '1F4E79', // Navy
    secondaryColor: '555555', // Charcoal
    textColor: '222222',
    nameSize: 48, // 24pt
    titleSize: 26, // 13pt
    headerSize: 22, // 11pt
    sectionSize: 24, // 12pt
    textSize: 20, // 10pt
    margins: 1080, // 0.75"
    skillsAtTop: true,
    educationAtTop: false,
    centeredHeader: false,
  },
  creative: {
    font: 'Georgia',
    primaryColor: '008080', // Teal
    secondaryColor: '4A6B82', // Slate
    textColor: '2D3748',
    nameSize: 52, // 26pt
    titleSize: 28, // 14pt
    headerSize: 20, // 10pt
    sectionSize: 26, // 13pt
    textSize: 21, // 10.5pt
    margins: 1152, // 0.8"
    skillsAtTop: false,
    educationAtTop: false,
    centeredHeader: false,
  },
  executive: {
    font: 'Garamond',
    primaryColor: '2C3E50', // Slate Charcoal
    secondaryColor: '5D6D7E', // Muted Gray
    textColor: '1A252C',
    nameSize: 56, // 28pt
    titleSize: 30, // 15pt
    headerSize: 20, // 10pt
    sectionSize: 28, // 14pt
    textSize: 22, // 11pt
    margins: 1440, // 1"
    skillsAtTop: false,
    educationAtTop: false,
    centeredHeader: true,
  },
  academic: {
    font: 'Times New Roman',
    primaryColor: '000000', // Black
    secondaryColor: '333333', // Charcoal
    textColor: '000000',
    nameSize: 52, // 26pt
    titleSize: 26, // 13pt
    headerSize: 20, // 10pt
    sectionSize: 24, // 12pt
    textSize: 22, // 11pt
    margins: 1440, // 1"
    skillsAtTop: false,
    educationAtTop: true,
    centeredHeader: true,
  },
  general: {
    font: 'Calibri',
    primaryColor: '333333', // Dark Gray
    secondaryColor: '666666', // Medium Gray
    textColor: '111111',
    nameSize: 48, // 24pt
    titleSize: 24, // 12pt
    headerSize: 20, // 10pt
    sectionSize: 24, // 12pt
    textSize: 21, // 10.5pt
    margins: 1440, // 1"
    skillsAtTop: false,
    educationAtTop: false,
    centeredHeader: false,
  }
};

/**
 * Helper to build a two-column row using borderless table for robust left-right alignment.
 */
function createTwoColumnRow(leftText, rightText, theme, isBold = true) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: leftText,
                    bold: isBold,
                    font: theme.font,
                    size: theme.textSize + 1,
                    color: theme.textColor,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: rightText,
                    italic: true,
                    font: theme.font,
                    size: theme.textSize,
                    color: theme.secondaryColor,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates a section heading with a bottom border line.
 */
function createSectionHeading(title, theme) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    keepWithNext: true,
    border: {
      bottom: {
        color: theme.primaryColor,
        space: 6,
        value: 'single',
        size: 12, // 1.5pt
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        font: theme.font,
        size: theme.sectionSize,
        color: theme.primaryColor,
      }),
    ],
  });
}

/**
 * Generates the document based on parsed resume JSON.
 */
function generateDocument(data) {
  const template = data.template && THEMES[data.template] ? data.template : 'general';
  const theme = THEMES[template];
  const pi = data.personalInfo || {};

  const children = [];

  // 1. Header (Name, Title, Contact Info)
  children.push(
    new Paragraph({
      alignment: theme.centeredHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: pi.name || 'Your Name',
          bold: true,
          font: theme.font,
          size: theme.nameSize,
          color: theme.primaryColor,
        }),
      ],
    })
  );

  if (pi.title) {
    children.push(
      new Paragraph({
        alignment: theme.centeredHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: pi.title,
            font: theme.font,
            size: theme.titleSize,
            color: theme.secondaryColor,
            italic: true,
          }),
        ],
      })
    );
  }

  // Contact Info Line
  const contactParts = [];
  if (pi.email) contactParts.push(pi.email);
  if (pi.phone) contactParts.push(pi.phone);
  if (pi.location) contactParts.push(pi.location);
  if (pi.linkedin) contactParts.push(`LinkedIn: ${pi.linkedin}`);
  if (pi.github) contactParts.push(`GitHub: ${pi.github}`);
  if (pi.website) contactParts.push(`Portfolio: ${pi.website}`);

  children.push(
    new Paragraph({
      alignment: theme.centeredHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: contactParts.join('   |   '),
          font: theme.font,
          size: theme.headerSize,
          color: theme.secondaryColor,
        }),
      ],
    })
  );

  // 2. Professional Summary
  if (data.summary) {
    children.push(createSectionHeading('Professional Summary', theme));
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: data.summary,
            font: theme.font,
            size: theme.textSize,
            color: theme.textColor,
          }),
        ],
      })
    );
  }

  // Pre-calculate sections
  const skillsSection = () => {
    if (!data.skills || data.skills.length === 0) return;
    children.push(createSectionHeading('Skills', theme));
    
    // Check if skills are categorized objects or flat strings
    const isCategorized = data.skills[0] && typeof data.skills[0] === 'object' && data.skills[0].category;
    
    if (isCategorized) {
      data.skills.forEach(skillGroup => {
        const categoryName = skillGroup.category;
        const skillList = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : '';
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${categoryName}: `,
                bold: true,
                font: theme.font,
                size: theme.textSize,
                color: theme.textColor,
              }),
              new TextRun({
                text: skillList,
                font: theme.font,
                size: theme.textSize,
                color: theme.textColor,
              }),
            ],
          })
        );
      });
    } else {
      // Flat list of skills
      const skillString = data.skills.join(', ');
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: skillString,
              font: theme.font,
              size: theme.textSize,
              color: theme.textColor,
            }),
          ],
        })
      );
    }
  };

  const experienceSection = () => {
    if (!data.experience || data.experience.length === 0) return;
    children.push(createSectionHeading('Professional Experience', theme));

    data.experience.forEach(exp => {
      // Job title and date row
      const titleLine = exp.position;
      const dateLine = exp.startDate && exp.endDate ? `${exp.startDate} – ${exp.endDate}` : (exp.startDate || '');
      children.push(createTwoColumnRow(titleLine, dateLine, theme, true));

      // Company and location row
      const companyLine = exp.company + (exp.location ? `, ${exp.location}` : '');
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: companyLine,
              font: theme.font,
              size: theme.textSize,
              color: theme.secondaryColor,
              italic: true,
            }),
          ],
        })
      );

      // Description bullets
      if (Array.isArray(exp.description)) {
        exp.description.forEach(bulletText => {
          if (bulletText.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: bulletText.trim(),
                    font: theme.font,
                    size: theme.textSize,
                    color: theme.textColor,
                  }),
                ],
              })
            );
          }
        });
      } else if (typeof exp.description === 'string' && exp.description.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: exp.description.trim(),
                font: theme.font,
                size: theme.textSize,
                color: theme.textColor,
              }),
            ],
          })
        );
      }
      // Add extra space after experience entry
      children.push(new Paragraph({ spacing: { after: 120 } }));
    });
  };

  const educationSection = () => {
    if (!data.education || data.education.length === 0) return;
    children.push(createSectionHeading('Education', theme));

    data.education.forEach(edu => {
      const degreeLine = edu.degree + (edu.major ? ` in ${edu.major}` : '');
      const dateLine = edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : (edu.startDate || edu.endDate || '');
      children.push(createTwoColumnRow(degreeLine, dateLine, theme, true));

      const instLine = edu.institution + (edu.location ? `, ${edu.location}` : '');
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: instLine,
              font: theme.font,
              size: theme.textSize,
              color: theme.secondaryColor,
              italic: true,
            }),
          ],
        })
      );

      if (edu.details) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: edu.details,
                font: theme.font,
                size: theme.textSize - 1,
                color: theme.textColor,
              }),
            ],
          })
        );
      } else {
        children.push(new Paragraph({ spacing: { after: 80 } }));
      }
    });
  };

  const projectsSection = () => {
    if (!data.projects || data.projects.length === 0) return;
    children.push(createSectionHeading('Projects', theme));

    data.projects.forEach(proj => {
      const titleLine = proj.name + (proj.role ? ` (${proj.role})` : '');
      const rightLine = proj.link || '';
      children.push(createTwoColumnRow(titleLine, rightLine, theme, true));

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: proj.description,
                font: theme.font,
                size: theme.textSize,
                color: theme.textColor,
              }),
            ],
          })
        );
      }
    });
  };

  const additionalSections = () => {
    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      children.push(createSectionHeading('Certifications & Licenses', theme));
      data.certifications.forEach(cert => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: cert,
                font: theme.font,
                size: theme.textSize,
                color: theme.textColor,
              }),
            ],
          })
        );
      });
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      children.push(createSectionHeading('Languages', theme));
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: data.languages.join(', '),
              font: theme.font,
              size: theme.textSize,
              color: theme.textColor,
            }),
          ],
        })
      );
    }
  };

  // Build the section sequence based on format
  if (theme.skillsAtTop) {
    skillsSection();
  }

  if (theme.educationAtTop) {
    educationSection();
    experienceSection();
  } else {
    experienceSection();
    educationSection();
  }

  if (!theme.skillsAtTop) {
    skillsSection();
  }

  projectsSection();
  additionalSections();

  // Create document
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: theme.margins,
              bottom: theme.margins,
              left: theme.margins,
              right: theme.margins,
            },
          },
        },
        children: children,
      },
    ],
  });
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/generate_cv.js <path-to-json-data> <path-to-output-docx>');
    process.exit(1);
  }

  const jsonPath = args[0];
  const outputPath = args[1];

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`Generating CV with template: ${data.template || 'general'}...`);
    const doc = generateDocument(data);

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully generated CV Word Document at: ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate CV Word document:', error);
    process.exit(1);
  }
}

main();
