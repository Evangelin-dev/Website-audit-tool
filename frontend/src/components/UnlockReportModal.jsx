import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', dial: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', dial: '+355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', dial: '+376', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', dial: '+244', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua and Barbuda', dial: '+1268', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', dial: '+374', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', dial: '+994', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', dial: '+1242', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', dial: '+1246', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', dial: '+375', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', dial: '+501', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', dial: '+229', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhutan', dial: '+975', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dial: '+387', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', dial: '+267', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', dial: '+673', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', dial: '+257', flag: '🇧🇮' },
  { code: 'KH', name: 'Cambodia', dial: '+855', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', dial: '+237', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'CV', name: 'Cape Verde', dial: '+238', flag: '🇨🇻' },
  { code: 'CF', name: 'Central African Republic', dial: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', dial: '+235', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', dial: '+269', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', dial: '+242', flag: '🇨🇬' },
  { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
  { code: 'HR', name: 'Croatia', dial: '+385', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', dial: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', dial: '+253', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', dial: '+1767', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', dial: '+1849', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', dial: '+240', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', dial: '+291', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', dial: '+372', flag: '🇪🇪' },
  { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', dial: '+679', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', dial: '+220', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', dial: '+995', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', dial: '+1473', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinea', dial: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', dial: '+245', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', dial: '+592', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', dial: '+509', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', dial: '+354', flag: '🇮🇸' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', dial: '+98', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', dial: '+964', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', dial: '+1876', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', dial: '+77', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', dial: '+686', flag: '🇰🇮' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', dial: '+996', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', dial: '+856', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', dial: '+371', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', dial: '+266', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', dial: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', dial: '+218', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', dial: '+423', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', dial: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'MO', name: 'Macau', dial: '+853', flag: '🇲🇴' },
  { code: 'MK', name: 'Macedonia', dial: '+389', flag: '🇲🇰' },
  { code: 'MG', name: 'Madagascar', dial: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', dial: '+265', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', dial: '+960', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', dial: '+356', flag: '🇲🇹' },
  { code: 'MH', name: 'Marshall Islands', dial: '+692', flag: '🇲🇭' },
  { code: 'MR', name: 'Mauritania', dial: '+222', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', dial: '+230', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', dial: '+691', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', dial: '+373', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', dial: '+377', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', dial: '+976', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', dial: '+382', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', dial: '+258', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', dial: '+95', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', dial: '+264', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', dial: '+674', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', dial: '+680', flag: '🇵🇼' },
  { code: 'PA', name: 'Panama', dial: '+507', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', dial: '+675', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', dial: '+250', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint Kitts and Nevis', dial: '+1869', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', dial: '+1758', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', dial: '+1784', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', dial: '+685', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', dial: '+378', flag: '🇸🇲' },
  { code: 'ST', name: 'Sao Tome and Principe', dial: '+239', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', dial: '+381', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', dial: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', dial: '+232', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', dial: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dial: '+386', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomon Islands', dial: '+677', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalia', dial: '+252', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', dial: '+211', flag: '🇸🇸' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', dial: '+249', flag: '🇸🇩' },
  { code: 'SR', name: 'Suriname', dial: '+597', flag: '🇸🇷' },
  { code: 'SZ', name: 'Swaziland', dial: '+268', flag: '🇸🇿' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', dial: '+963', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', dial: '+992', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', dial: '+670', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', dial: '+676', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad and Tobago', dial: '+1868', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', dial: '+993', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', dial: '+688', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', dial: '+998', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', dial: '+678', flag: '🇻🇺' },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', dial: '+967', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', dial: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263', flag: '🇿🇼' },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === 'US');

const CountryCodeSelector = ({ selectedCountry, onChange, dialCode, onDialCodeChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const buttonRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search)
      )
    : COUNTRIES;

  const handleOpen = () => {
    if (disabled) return;
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // store position for portal
      buttonRef.current._rect = rect;
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        const portal = document.getElementById('country-dropdown-portal');
        if (portal && portal.contains(e.target)) return;
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current && searchRef.current.focus(), 50);
    }
  }, [open]);

  // Compute portal position from button rect
  const getPortalStyle = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      zIndex: 99999,
      width: '260px',
    };
  };

  const dropdown = open
    ? createPortal(
        <div id="country-dropdown-portal" style={getPortalStyle()}>
          <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search country or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <ul className="overflow-y-auto" style={{ maxHeight: '200px' }}>
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 text-xs">No results found</li>
              ) : (
                filtered.map((c) => (
                  <li
                    key={c.code}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(c);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 ${
                      c.code === selectedCountry.code ? 'bg-gray-700 text-blue-400' : 'text-white'
                    }`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate text-xs">{c.name}</span>
                    <span className="text-gray-400 text-xs flex-shrink-0">{c.dial}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="flex items-center flex-shrink-0 bg-gray-600 border-r border-gray-500 rounded-l-lg">
      {/* Flag + dropdown toggle */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        title="Select country"
        className="flex items-center gap-1 pl-3 pr-1 py-2 hover:bg-gray-500 rounded-l-lg transition focus:outline-none h-full"
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Editable dial code input */}
      <input
        type="text"
        value={dialCode}
        onChange={(e) => {
          let val = e.target.value;
          if (!val.startsWith('+')) val = '+' + val.replace(/\+/g, '');
          val = val.replace(/[^\d+]/g, '');
          onDialCodeChange(val);
        }}
        disabled={disabled}
        maxLength={6}
        className="w-14 bg-transparent text-gray-300 text-xs text-center focus:outline-none focus:text-white pr-2 py-2"
        title="Edit country code"
      />

      {dropdown}
    </div>
  );
};

const UnlockReportModal = ({ isOpen, onUnlock, websiteUrl, taskId, onClose }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    website_url: websiteUrl || '',
  });
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dial);
  const [localPhone, setLocalPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLocalPhoneChange = (e) => {
    const digits = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    setLocalPhone(digits);
    setFormData((prev) => ({
      ...prev,
      phone_number: `${dialCode}${digits.replace(/\D/g, '')}`,
    }));
    setError('');
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setDialCode(country.dial);
    setFormData((prev) => ({
      ...prev,
      phone_number: `${country.dial}${localPhone.replace(/\D/g, '')}`,
    }));
  };

  const handleDialCodeChange = (val) => {
    setDialCode(val);
    // Auto-match flag if the code matches a known country
    const match = COUNTRIES.find((c) => c.dial === val);
    if (match) setSelectedCountry(match);
    setFormData((prev) => ({
      ...prev,
      phone_number: `${val}${localPhone.replace(/\D/g, '')}`,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.user_name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!localPhone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    const digitsOnly = localPhone.replace(/\D/g, '');
    if (digitsOnly.length < 4 || digitsOnly.length > 15) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.website_url.trim()) {
      setError('Website URL is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/reporter-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          email: formData.email,
          phone_number: formData.phone_number,
          website_url: formData.website_url,
          task: taskId || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Call onUnlock callback to unlock the report
        onUnlock({
          id: data.id,
          user_name: data.user_name,
          email: data.email,
          phone_number: data.phone_number,
          website_url: data.website_url,
          submission_date: data.submission_date,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to unlock report. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-700"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">🔓 Unlock Report</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Enter your details to access the full audit report
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition flex-shrink-0"
              title="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="user_name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              placeholder=""
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.user_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=""
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Phone Number
            </label>
            <div className={`flex border rounded-lg ${
              error && !localPhone ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-600 focus-within:ring-2 focus-within:ring-blue-500'
            }`}>
              <CountryCodeSelector
                selectedCountry={selectedCountry}
                onChange={handleCountryChange}
                dialCode={dialCode}
                onDialCodeChange={handleDialCodeChange}
                disabled={loading}
              />
              <input
                type="tel"
                value={localPhone}
                onChange={handleLocalPhoneChange}
                placeholder="9876543210"
                disabled={loading}
                className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm focus:outline-none placeholder-gray-500 rounded-r-lg min-w-0"
              />
            </div>
            {formData.phone_number && (
              <p className="text-gray-500 text-xs mt-1">
                Full number: {formData.phone_number}
              </p>
            )}
          </div>

          {/* Website URL Field */}
          <div>
            <label htmlFor="website_url" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.website_url ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-2 sm:p-3">
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {loading ? 'Processing...' : '🔓 Unlock Report'}
          </button>
        </form>

        {/* Note */}
        <p className="text-gray-500 text-xs mt-3 sm:mt-4 text-center">
          Your information will be securely saved and used only for report access verification.
        </p>
      </motion.div>
    </div>
  );
};

export default UnlockReportModal;
