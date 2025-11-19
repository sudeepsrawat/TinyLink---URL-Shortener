import './globals.css';

export const metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten your URLs with TinyLink',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <header className="header">
            <h1>TinyLink</h1>
            <nav>
              <a href="/">Dashboard</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <p>&copy; 2024 TinyLink. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}