import React from 'react';

export const Hint: React.FC<React.SVGAttributes<{}>> = (props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="24" height="24" rx="12" fill="#FE3678" />
            <path
                d="M11.0455 14.5114V14.3182C11.0492 13.6553 11.108 13.1269 11.2216 12.733C11.339 12.339 11.5095 12.0208 11.733 11.7784C11.9564 11.536 12.2254 11.3163 12.5398 11.1193C12.7746 10.9678 12.9848 10.8106 13.1705 10.6477C13.3561 10.4848 13.5038 10.3049 13.6136 10.108C13.7235 9.9072 13.7784 9.68371 13.7784 9.4375C13.7784 9.17614 13.7159 8.94697 13.5909 8.75C13.4659 8.55303 13.2973 8.40151 13.0852 8.29545C12.8769 8.18939 12.6458 8.13636 12.392 8.13636C12.1458 8.13636 11.9129 8.19129 11.6932 8.30114C11.4735 8.4072 11.2936 8.56629 11.1534 8.77841C11.0133 8.98674 10.9375 9.24621 10.9261 9.55682H8.60795C8.62689 8.79924 8.80871 8.17424 9.15341 7.68182C9.49811 7.18561 9.95455 6.81629 10.5227 6.57386C11.0909 6.32765 11.7178 6.20455 12.4034 6.20455C13.1572 6.20455 13.8239 6.32955 14.4034 6.57955C14.983 6.82576 15.4375 7.18371 15.767 7.65341C16.0966 8.12311 16.2614 8.68939 16.2614 9.35227C16.2614 9.79545 16.1875 10.1894 16.0398 10.5341C15.8958 10.875 15.6932 11.178 15.4318 11.4432C15.1705 11.7045 14.8617 11.9413 14.5057 12.1534C14.2064 12.3314 13.9602 12.517 13.767 12.7102C13.5777 12.9034 13.4356 13.1269 13.3409 13.3807C13.25 13.6345 13.2027 13.947 13.1989 14.3182V14.5114H11.0455ZM12.1705 18.1477C11.7917 18.1477 11.4678 18.0152 11.1989 17.75C10.9337 17.4811 10.803 17.1591 10.8068 16.7841C10.803 16.4129 10.9337 16.0947 11.1989 15.8295C11.4678 15.5644 11.7917 15.4318 12.1705 15.4318C12.5303 15.4318 12.8466 15.5644 13.1193 15.8295C13.392 16.0947 13.5303 16.4129 13.5341 16.7841C13.5303 17.0341 13.464 17.2633 13.3352 17.4716C13.2102 17.6761 13.0455 17.8409 12.8409 17.9659C12.6364 18.0871 12.4129 18.1477 12.1705 18.1477Z"
                fill="white"
            />
        </svg>
    );
};
