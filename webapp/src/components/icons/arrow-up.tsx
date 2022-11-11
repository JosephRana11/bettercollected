import React from 'react';

export const ArrowUp: React.FC<React.SVGAttributes<{}>> = (props) => {
    return (
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M1.43184 4.87415C1.16148 5.14451 0.723135 5.14451 0.452772 4.87415C0.182409 4.60379 0.182409 4.16544 0.452772 3.89508L4.14508 0.202772C4.41544 -0.0675908 4.85379 -0.0675907 5.12415 0.202772L8.81646 3.89508C9.08682 4.16544 9.08682 4.60379 8.81646 4.87415C8.5461 5.14451 8.10775 5.14451 7.83739 4.87415L5.32692 2.36369L5.32692 11.3077C5.32692 11.69 5.01697 12 4.63461 12C4.25226 12 3.94231 11.69 3.94231 11.3077L3.94231 2.36369L1.43184 4.87415Z"
                fill="currentColor"
            />
        </svg>
    );
};
