"use client";

import { GeneratedContent } from "@/types";

interface Props {
  content: GeneratedContent;
}

/**
 * Hidden print-only layout used exclusively for PDF generation.
 * Styled with clean black-and-white typography and proper page breaks.
 */
export function PrintTemplate({ content }: Props) {
  return (
    <div
      id="brand-print-package"
      className="hidden print:block"
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "#111",
        background: "#fff",
        padding: "40px",
        width: "794px",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: "2px solid #111", paddingBottom: "16px", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
          Complete Brand Kit
        </h1>
        <p style={{ fontSize: "13px", color: "#555", margin: "6px 0 0 0" }}>
          Generated for {content.answers.name || "You"} · {new Date(content.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stories */}
      <Section title="Personal Brand Story – Professional">
        <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{content.stories.professional}</p>
      </Section>

      <Section title="Personal Brand Story – Friendly">
        <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{content.stories.friendly}</p>
      </Section>

      <Section title="Personal Brand Story – Bold">
        <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{content.stories.bold}</p>
      </Section>

      {/* LinkedIn */}
      <Section title="LinkedIn Headline">
        <p style={{ fontSize: "13px", fontWeight: 600 }}>{content.linkedinHeadline}</p>
      </Section>

      <Section title="LinkedIn Bio">
        <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{content.linkedinBio}</p>
      </Section>

      {/* Social Ads */}
      <Section title="Social Ads Copy">
        {content.ads?.map((ad) => (
          <div key={ad.platform} style={{ marginBottom: "18px", pageBreakInside: "avoid" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", margin: "0 0 6px 0" }}>
              {ad.platform}
            </h3>
            <p style={{ fontSize: "12px", margin: "2px 0" }}><strong>Hook:</strong> {ad.hook}</p>
            <p style={{ fontSize: "12px", margin: "2px 0" }}><strong>Body:</strong> {ad.body}</p>
            <p style={{ fontSize: "12px", margin: "2px 0" }}><strong>CTA:</strong> {ad.cta}</p>
            {ad.hashtags?.length ? (
              <p style={{ fontSize: "12px", margin: "2px 0" }}>
                <strong>Hashtags:</strong> {ad.hashtags.join(" ")}
              </p>
            ) : null}
          </div>
        ))}
      </Section>

      {/* Elevator Pitch */}
      <Section title="60-Second Elevator Pitch">
        <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{content.elevatorPitch}</p>
      </Section>

      {/* Pitch Slides */}
      <Section title="Pitch Deck Outline (5 Slides)">
        {content.pitchSlides?.map((slide, i) => (
          <div key={i} style={{ marginBottom: "14px", pageBreakInside: "avoid" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 4px 0" }}>
              Slide {i + 1}: {slide.title}
            </h3>
            <p style={{ fontSize: "12px", margin: "2px 0" }}><strong>Message:</strong> {slide.coreMessage}</p>
            <p style={{ fontSize: "12px", margin: "2px 0", color: "#555" }}>
              <strong>Visual:</strong> {slide.visualCue}
            </p>
          </div>
        ))}
      </Section>

      {/* Content Ideas */}
      <Section title="Content Ideas">
        <ol style={{ paddingLeft: "18px", margin: 0 }}>
          {content.contentIdeas.map((idea, i) => (
            <li key={i} style={{ fontSize: "12px", marginBottom: "6px" }}>
              {idea}
            </li>
          ))}
        </ol>
      </Section>

      <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "12px", fontSize: "11px", color: "#888" }}>
        Generated with BrandStory AI · All content is AI-assisted and fully editable.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "26px", pageBreakInside: "avoid" }}>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          margin: "0 0 10px 0",
          borderBottom: "1px solid #eee",
          paddingBottom: "4px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
