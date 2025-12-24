import { SafeImage } from '@/components/ui/SafeImage';
import styles from './Welcome.module.scss';


interface WelcomeProps {
    onNext?: () => void;
}

export const Welcome = ({ onNext }: WelcomeProps) => {
    const avatars = [
        { id: 1, src: '/avatars/avatar-1.jpg', alt: 'User 1' },
        { id: 2, src: '/avatars/avatar-2.jpg', alt: 'User 2' },
        { id: 3, src: '/avatars/avatar-3.jpg', alt: 'User 3' },
        { id: 4, src: '/avatars/avatar-4.jpg', alt: 'User 4' },
    ];

    return (
        <div className={styles.welcome}>
            <div className={styles.welcome__left}>
                <div className={styles.welcome__left__header}>
                    <div className={styles.welcome__left__blur} />
                    <div className={styles.welcome__left__blur2} />

                    <div className={styles.welcome__logo}>
                        <SafeImage src="/Nebula.svg" alt="Nebula" fill />
                    </div>

                    <div className={styles.welcome__content}>
                        <div className={styles.welcome__badge}>
                            <div className={styles.welcome__badge__avatars}>
                                {avatars.map((avatar) => (
                                    <div key={avatar.id} className={styles.welcome__badge__avatars__item}>
                                        <SafeImage src={avatar.src} alt={avatar.alt} fill />
                                    </div>
                                ))}
                            </div>
                            <span className={styles.welcome__badge__text}>
                                1,000+ makers have already joined
                            </span>
                        </div>

                        <div className={styles.welcome__text}>
                            <h1 className={styles.welcome__text__title}>
                                Welcome to
                                <br />
                                Nebula
                            </h1>
                            <p className={styles.welcome__text__description}>
                                Enter the cloud of innovation and performance.
                            </p>
                        </div>
                    </div>

                </div>
                <button className={styles.welcome__button} onClick={onNext}>Next</button>
            </div>

            <div className={styles.welcome__right}>
                <div className={styles.welcome__right__blur} />
                <div className={styles.welcome__right__blur2} />
                <div className={styles.welcome__right__image}>
                    <SafeImage
                        src="/onboarding.gif"
                        alt="Welcome"
                        fill
                    />
                </div>
                <p className={styles.welcome__right__text}>AI is waiting ...</p>
            </div>
        </div>
    );
};
