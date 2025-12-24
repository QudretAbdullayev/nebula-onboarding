import { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import styles from './SetPassword.module.scss';

interface SetPasswordProps {
    onNext?: () => void;
}

export const SetPassword = ({ onNext }: SetPasswordProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onNext) onNext();
    };

    return (
        <div className={styles.password}>
            <div className={styles.password__left}>
                <div className={styles.password__left__blur} />
                <div className={styles.password__left__blur2} />

                <div className={styles.password__logo}>
                    <SafeImage src="/Nebula.svg" alt="Nebula" fill />
                </div>

                <form className={styles.password__form} onSubmit={handleSubmit}>
                    <div className={styles.password__form__header}>
                        <h1 className={styles.password__form__title}>Set Your Password</h1>
                        <p className={styles.password__form__description}>
                            Create a strong password to activate your account.
                        </p>
                    </div>

                    <div className={styles.password__form__fields}>
                        <div className={styles.password__form__field}>
                            <label className={styles.password__form__field__label}>
                                Your Email
                            </label>
                            <input
                                type="email"
                                placeholder="nebula@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.password__form__field__input}
                            />
                        </div>

                        <div className={styles.password__form__field}>
                            <label className={styles.password__form__field__label}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.password__form__field__input}
                            />
                        </div>
                    </div>
                </form>

                <button className={styles.password__button} onClick={handleSubmit}>
                    Next
                </button>
            </div>

            <div className={styles.password__right}>
                <div className={styles.password__right__blur} />
                <div className={styles.password__right__blur2} />
                <div className={styles.password__right__image}>
                    <SafeImage
                        src="/onboarding.gif"
                        alt="AI"
                        fill
                    />
                </div>
                <p className={styles.password__right__text}>AI is waiting ...</p>
            </div>
        </div>
    );
};
