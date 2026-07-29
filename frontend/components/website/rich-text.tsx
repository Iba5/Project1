import type { RichText as RichTextValue } from "@/lib/cms";

type RichTextProps = {
  value: RichTextValue;
  className?: string;
};

export function RichText({ value, className }: RichTextProps) {
  if (!value) return null;

  const paragraphs: string[] = Array.isArray(value)
    ? value.map((item) =>
        typeof item === "string"
          ? item
          : (item?.children ?? [])
              .map((child: any) => child?.text ?? "")
              .join(""),
      )
    : [value];

  return (
    <div className={className}>
      {paragraphs.filter(Boolean).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
