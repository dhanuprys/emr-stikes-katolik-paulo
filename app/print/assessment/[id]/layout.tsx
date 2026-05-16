export default function PrintAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bypass main app layout — render raw HTML for print
  return <>{children}</>;
}
