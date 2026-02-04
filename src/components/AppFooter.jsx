export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white border-t border-white/10 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">CampusSync</h4>
            <p className="text-white/80 text-sm">
              Where Learning Meets Belonging
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>&copy; {currentYear} CampusSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
