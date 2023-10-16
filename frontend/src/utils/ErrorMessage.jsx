import PropTypes from "prop-types";

function ErrorMessage({ text }) {
  return <p className="ErrorMessage">{text}</p>;
}

ErrorMessage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ErrorMessage;
