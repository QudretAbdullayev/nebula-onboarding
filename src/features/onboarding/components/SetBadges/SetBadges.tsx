import { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import Back from '@/assets/icons/Back';
import BadgeArrow from '@/assets/icons/BadgeArrow';
import styles from './SetBadges.module.scss';

interface SetBadgesProps {
    onNext?: () => void;
    onBack?: () => void;
}

export const SetBadges = ({ onNext, onBack }: SetBadgesProps) => {
    const [badges, setBadges] = useState([
        { id: 1, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 2, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 3, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 4, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 5, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 6, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 7, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 8, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 9, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 10, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 11, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 12, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 13, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 14, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
        { id: 15, title: 'Creative Thinking', description: 'For generating sales, saving costs, or', rating: 0.40 },
    ]);

    const handleRatingChange = (id: number, increment: boolean) => {
        setBadges(badges.map(badge => {
            if (badge.id === id) {
                const newRating = badge.rating + (increment ? 0.05 : -0.05);
                return { ...badge, rating: Math.max(0, Math.min(1, newRating)) };
            }
            return badge;
        }));
    };

    // Group badges into rows of 3
    const rows = [];
    for (let i = 0; i < badges.length; i += 3) {
        rows.push(badges.slice(i, i + 3));
    }

    return (
        <div className={styles.badges}>
            <div className={styles.badges__blur} />
            <div className={styles.badges__blur2} />

            <header className={styles.badges__header}>
                <button className={styles.badges__header__back} onClick={onBack}>
                    <Back />
                    <span>Back</span>
                </button>

                <div className={styles.badges__header__info}>
                    <h1 className={styles.badges__header__title}>Set Badges</h1>
                    <p className={styles.badges__header__description}>
                        Rate each competency based on your performance this month.
                    </p>
                </div>
            </header>

            <div className={styles.badges__content}>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.badges__row}>
                        {row.map((badge) => (
                            <div key={badge.id} className={styles.badges__card}>
                                <div className={styles.badges__card__icon}>
                                    <div className={styles.badges__card__icon__blur} />
                                    <div className={styles.badges__card__icon__blur2} />
                                    <div className={styles.badges__card__icon__blur3} />
                                    <SafeImage src="/badges/badge-1.svg" alt={`${badge.title}`} fill />
                                </div>

                                <div className={styles.badges__card__content}>
                                    <h3 className={styles.badges__card__title}>{badge.title}</h3>
                                    <p className={styles.badges__card__description}>{badge.description}</p>
                                </div>

                                <div className={styles.badges__card__rating}>
                                    <span className={styles.badges__card__rating__value}>
                                        {badge.rating.toFixed(2)}
                                    </span>
                                    <div className={styles.badges__card__rating__controls}>
                                        <button
                                            className={styles.badges__card__rating__button}
                                            onClick={() => handleRatingChange(badge.id, true)}
                                        >
                                            <BadgeArrow />
                                        </button>
                                        <button
                                            className={styles.badges__card__rating__button}
                                            onClick={() => handleRatingChange(badge.id, false)}
                                        >
                                            <BadgeArrow style={{ transform: 'rotate(180deg)' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <footer className={styles.badges__footer}>
                <button className={styles.badges__footer__skip} onClick={onNext}>Skip</button>
                <button className={styles.badges__footer__next} onClick={onNext}>Next</button>
            </footer>
        </div>
    );
};
