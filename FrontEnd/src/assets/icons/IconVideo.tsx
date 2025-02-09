import { IconProps } from "@utils/iconProps";

const IconVideo = ({ width, height, fillColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.9098 5.40411V1.26699C16.9098 0.616876 16.3779 0.0849609 15.7278 0.0849609H1.54336C0.893243 0.0849609 0.361328 0.616876 0.361328 1.26699V13.0873C0.361328 13.7374 0.893243 14.2694 1.54336 14.2694H15.7278C16.3779 14.2694 16.9098 13.7374 16.9098 13.0873V8.95021L21.6379 13.6783V0.675978L16.9098 5.40411Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconVideo;
