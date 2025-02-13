import { IconProps } from "@utils/iconProps";

const IconReport = ({ width = 42, height = 36, fillColor = "cardContent" }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.00574 36.005H39.0657C40.6057 36.005 41.5657 34.345 40.8057 33.005L22.2657 1.005C21.4857 -0.335 19.5657 -0.335 18.8057 1.005L0.265743 33.005C-0.494257 34.345 0.465743 36.005 2.00574 36.005ZM22.5457 30.005H18.5457V26.005H22.5457V30.005ZM20.5457 22.005C19.4457 22.005 18.5457 21.105 18.5457 20.005V16.005C18.5457 14.905 19.4457 14.005 20.5457 14.005C21.6457 14.005 22.5457 14.905 22.5457 16.005V20.005C22.5457 21.105 21.6457 22.005 20.5457 22.005Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default IconReport;
