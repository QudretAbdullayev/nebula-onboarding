import type { SVGProps } from 'react';

export const BadgeArrow = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="10"
        height="5"
        viewBox="0 0 10 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M10 5H0L5 0L10 5Z" fill="currentColor" />
    </svg>
);

export default BadgeArrow;
