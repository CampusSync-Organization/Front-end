const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input;
