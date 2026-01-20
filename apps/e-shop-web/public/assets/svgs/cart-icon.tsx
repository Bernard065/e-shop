const CartIcon = ({ className }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="20" r="1.5" fill="#000" />
    <circle cx="18" cy="20" r="1.5" fill="#000" />
    <path
      d="M2 3h2l2.68 12.39A2 2 0 0 0 8.6 17h8.55a2 2 0 0 0 1.92-1.45L22 6H6"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CartIcon;
