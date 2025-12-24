import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    fill,
    className,
    style,
    ...rest
}) => {
    const [error, setError] = useState(false);

    if (!src || typeof src !== 'string' || src.trim() === '') {
        return null;
    }

    if (error) {
        return null; // Or return a fallback image/placeholder
    }

    const imageStyles: React.CSSProperties = {
        ...style,
        ...(fill ? {
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            objectFit: 'cover'
        } : {})
    };

    return (
        <img
            src={src}
            alt={alt || ''}
            className={className}
            style={imageStyles}
            onError={() => setError(true)}
            {...rest}
        />
    );
};
