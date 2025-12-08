import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/logo-color.png" 
                alt="Miquel A. Riudavets" 
                width={40} 
                height={67}
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-base font-semibold">Miquel A. Riudavets Mercadal</h3>
                <p className="text-gray-400 text-sm">Pintura i Reformes</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Arreglos de Carpinteria, Pintado y Barnizado en General 
              (Paredes Interiores, Exteriores y Carpinteria)
            </p>
            <p className="text-gray-500 text-xs">NIF: 41 497 721 V</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Enllaços</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inici
                </Link>
              </li>
              <li>
                <Link href="/serveis" className="text-gray-400 hover:text-white transition-colors">
                  Serveis
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                  Treballs
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-gray-400 hover:text-white transition-colors">
                  Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Contacte</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                Caseriu Trebaluger, 26
              </li>
              <li className="text-gray-400">
                07720 Es Castell, Menorca
              </li>
              <li>
                <a href="tel:+34656921314" className="text-gray-400 hover:text-white transition-colors">
                  656 92 13 14
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} Miquel A. Riudavets Mercadal. Tots els drets reservats.
          </p>
        </div>
      </div>
    </footer>
  );
}
