import { cn } from "@/lib/utils";

type IconType = {
  size?: number;
  className?: string;
  id?: string;
  stroke?: number
};

export const CloseIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Close icon</title>
    <path
      d="M9.77817 11.1924L16.1421 17.5563L17.5563 16.1421L11.1924 9.77817L17.5563 3.41421L16.1421 2L9.77817 8.36396L3.41421 2L2 3.41421L8.36396 9.77817L2 16.1421L3.41421 17.5563L9.77817 11.1924Z"
      fill="currentColor"
    />
  </svg>
);

export const ArrowLeftIcon = ({ size = 16, className, id }: IconType) => (
  <svg
    id={id}
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 ",
      className,
    )}
  >
    <title>Arrow pointing left icon</title>
    <path
      d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
      fill="currentColor"
    />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, className, id }: IconType) => (
  <svg
    id={id}
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100",
      className,
    )}
  >
    <title>Arrow pointing right icon</title>
    <path
      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Chevron pointing down icon</title>
    <path
      d="M9.29289 11.2071C9.68342 11.5977 10.3166 11.5977 10.7071 11.2071L15.6061 6.30818C15.9966 5.91766 16.6298 5.91766 17.0203 6.30818L17.2929 6.58079C17.6834 6.97132 17.6834 7.60448 17.2929 7.99501L11.5181 13.7698C10.6797 14.6082 9.32031 14.6082 8.48186 13.7698L2.70711 7.99501C2.31658 7.60448 2.31658 6.97132 2.70711 6.58079L2.97972 6.30818C3.37024 5.91766 4.00341 5.91766 4.39393 6.30818L9.29289 11.2071Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronUpIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Chevron pointing up icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.29289 8.79286C9.68342 8.40233 10.3166 8.40233 10.7071 8.79286L15.6061 13.6918C15.9966 14.0823 16.6298 14.0823 17.0203 13.6918L17.2929 13.4192C17.6834 13.0287 17.6834 12.3955 17.2929 12.005L11.5181 6.23024C10.6797 5.3918 9.32031 5.3918 8.48186 6.23024L2.70711 12.005C2.31658 12.3955 2.31658 13.0287 2.70711 13.4192L2.97972 13.6918C3.37024 14.0823 4.00341 14.0823 4.39393 13.6918L9.29289 8.79286Z"
      fill="currentColor"
    />
  </svg>
);

export const LinkIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Link icon</title>
    <path
      d="M4 6.25C3.58579 6.25 3.25 6.58579 3.25 7V16C3.25 16.4142 3.58579 16.75 4 16.75H13C13.4142 16.75 13.75 16.4142 13.75 16V11.5C13.75 11.0858 14.0858 10.75 14.5 10.75C14.9142 10.75 15.25 11.0858 15.25 11.5V16C15.25 17.2426 14.2426 18.25 13 18.25H4C2.75736 18.25 1.75 17.2426 1.75 16V7C1.75 5.75736 2.75736 4.75 4 4.75H8.5C8.91421 4.75 9.25 5.08579 9.25 5.5C9.25 5.91421 8.91421 6.25 8.5 6.25H4Z"
      fill="currentColor"
    />
    <path
      d="M10.75 1.75L17.5 1.75C17.9142 1.75 18.25 2.08579 18.25 2.5V9.25C18.25 9.66421 17.9142 10 17.5 10C17.0858 10 16.75 9.66421 16.75 9.25V4.31066L9.03033 12.0303C8.73744 12.3232 8.26256 12.3232 7.96967 12.0303C7.67678 11.7374 7.67678 11.2626 7.96967 10.9697L15.6893 3.25L10.75 3.25C10.3358 3.25 10 2.91421 10 2.5C10 2.08579 10.3358 1.75 10.75 1.75Z"
      fill="currentColor"
    />
  </svg>
);

export const SandGlassIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Sand glass icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.25 2.5C3.25 2.08579 3.58579 1.75 4 1.75H16C16.4142 1.75 16.75 2.08579 16.75 2.5C16.75 2.91421 16.4142 3.25 16 3.25H15.25V4.67157C15.25 5.40092 14.9603 6.10039 14.4445 6.61612L11.0607 10L14.4445 13.3839C14.9603 13.8996 15.25 14.5991 15.25 15.3284V16.75H16C16.4142 16.75 16.75 17.0858 16.75 17.5C16.75 17.9142 16.4142 18.25 16 18.25H4C3.58579 18.25 3.25 17.9142 3.25 17.5C3.25 17.0858 3.58579 16.75 4 16.75H4.75V15.3284C4.75 14.5991 5.03973 13.8996 5.55546 13.3839L8.93934 10L5.55546 6.61612C5.03973 6.10039 4.75 5.40092 4.75 4.67157V3.25H4C3.58579 3.25 3.25 2.91421 3.25 2.5ZM6.25 3.25V4.67157C6.25 5.00309 6.3817 5.32104 6.61612 5.55546L10 8.93934L13.3839 5.55546C13.6183 5.32104 13.75 5.00309 13.75 4.67157V3.25H6.25ZM10 11.0607L6.61612 14.4445C6.3817 14.679 6.25 14.9969 6.25 15.3284V16.75H13.75V15.3284C13.75 14.9969 13.6183 14.679 13.3839 14.4445L10 11.0607Z"
      fill="currentColor"
    />
  </svg>
);

export const PlusIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Plus icon</title>
    <path
      d="M10 2C10.5523 2 11 2.44772 11 3V9H17C17.5523 9 18 9.44772 18 10C18 10.5523 17.5523 11 17 11H11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11H3C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9H9V3C9 2.44772 9.44772 2 10 2Z"
      fill="currentColor"
    />
  </svg>
);

export const MinusIcon = ({ size = 16, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Minus icon</title>
    <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
  </svg>
);

export const Darken = ({ size = 16, stroke = 1, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Darken</title>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M7.5 7.5L1 1M7.5 7.5L7.5 3M7.5 7.5L3 7.5" stroke="currentColor" stroke-width={stroke} />
    <path d="M7.5 16.5L1 23M7.5 16.5L7.5 21M7.5 16.5L3 16.5" stroke="currentColor" stroke-width={stroke} />
    <path d="M16.5 7.5L23 1M16.5 7.5L21 7.5M16.5 7.5V3" stroke="currentColor" stroke-width={stroke} />
    <path d="M16.5 16.5L23 23M16.5 16.5L21 16.5M16.5 16.5V21" stroke="currentColor" stroke-width={stroke} />
  </svg>
);

export const Lighten = ({ size = 16, stroke = 1, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Lighten</title>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width={stroke} />
    <path d="M22.5 1.5L18 6M22.5 1.5L22.5 6M22.5 1.5L18 1.5" stroke="currentColor" stroke-width={stroke} />
    <path d="M1.5 1.5L6 6M1.5 1.5L6 1.5M1.5 1.5V6" stroke="currentColor" stroke-width={stroke} />
    <path d="M1.5 22.5L6 18M1.5 22.5L6 22.5M1.5 22.5V18" stroke="currentColor" stroke-width={stroke} />
    <path d="M22.5 22.5L18 18M22.5 22.5L18 22.5M22.5 22.5V18" stroke="currentColor" stroke-width={stroke} />
  </svg>
);

export const Brush = ({ size = 16, stroke = 1, className }: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "block select-none shrink-0 transition-all duration-100 text-foreground",
      className,
    )}
  >
    <title>Brush</title>
    <path d="M14 15L11 18L8 15.5L10.5 12M14 15L23 1L10.5 12M14 15L10.5 12" stroke="currentColor" stroke-width={stroke} />
    <path d="M4.5 17C5.49644 15.4986 7.00356 15.3347 8.00356 15.5014L11.0036 18C10.0036 24 -1.99644 22 1.00356 22C4.00356 22 3.50356 18.5014 4.5 17Z" stroke="currentColor" stroke-width={stroke} />
  </svg>



);
