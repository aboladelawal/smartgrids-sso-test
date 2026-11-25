export const metadata = { title: "Smart Grids SSO test" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 24, maxWidth: 960 }}>
        {children}
      </body>
    </html>
  );
}
