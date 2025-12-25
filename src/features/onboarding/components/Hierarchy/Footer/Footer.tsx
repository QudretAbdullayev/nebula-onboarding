import styles from './Footer.module.scss';

interface FooterProps {
    onNext?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
}

export const Footer = ({ onNext, onZoomIn, onZoomOut }: FooterProps) => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer__zoom}>
                <button
                    className={styles.footer__zoom__button}
                    onClick={onZoomOut}
                >
                    −
                </button>
                <div className={styles.footer__zoom__divider} />
                <button
                    className={styles.footer__zoom__button}
                    onClick={onZoomIn}
                >
                    +
                </button>
            </div>

            <div className={styles.footer__actions}>
                <button className={styles.footer__actions__skip} onClick={onNext}>
                    Skip
                </button>
                <button className={styles.footer__actions__next} onClick={onNext}>
                    Next
                </button>
            </div>
        </footer>
    );
};
