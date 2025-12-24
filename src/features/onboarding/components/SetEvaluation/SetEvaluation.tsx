import { useState } from 'react';
import CaretLeft from '@/assets/icons/CaretLeft';
import Plus from '@/assets/icons/Plus';
import Edit from '@/assets/icons/Edit';
import Trash from '@/assets/icons/Trash';
import styles from './SetEvaluation.module.scss';

interface SetEvaluationProps {
    onNext?: () => void;
    onBack?: () => void;
}

export const SetEvaluation = ({ onNext, onBack }: SetEvaluationProps) => {
    const [activeTab, setActiveTab] = useState('senior-manager');

    const tabs = [
        { id: 'senior-manager', label: 'Senior Manager' },
        { id: 'middle-manager', label: 'Middle Manager' },
        { id: 'individual', label: 'Individual' },
    ];

    const categories = [
        {
            id: 1,
            title: 'IMPACT',
            percentage: '40%',
            criteria: [
                { id: 1, percentage: '25%', title: 'Execution', description: 'Mentoring and leadership building or' },
                { id: 2, percentage: '25%', title: 'Productivity', description: 'Mentoring and leadership building or' },
                { id: 3, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 4, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 5, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
            ],
        },
        {
            id: 2,
            title: 'INTERACTION',
            percentage: '30%',
            criteria: [
                { id: 1, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 2, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 3, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
            ],
        },
        {
            id: 3,
            title: 'RESPONSIBILITY',
            percentage: '30%',
            criteria: [
                { id: 1, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 2, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
                { id: 3, percentage: '25%', title: 'Team Management', description: 'Mentoring and leadership building or' },
            ],
        },
    ];

    return (
        <div className={styles.evaluation}>
            <div className={styles.evaluation__blur} />
            <div className={styles.evaluation__blur2} />

            <header className={styles.evaluation__header}>
                <button className={styles.evaluation__header__back} onClick={onBack}>
                    <CaretLeft />
                    <span>Back</span>
                </button>

                <div className={styles.evaluation__header__info}>
                    <h1 className={styles.evaluation__header__title}>Set Evaluation</h1>
                    <p className={styles.evaluation__header__description}>
                        Rate each competency based on your performance this month.
                    </p>
                </div>
            </header>

            <div className={styles.evaluation__tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.evaluation__tabs__item} ${activeTab === tab.id ? styles.evaluation__tabs__item__active : ''
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.evaluation__content}>
                {categories.map((category) => (
                    <div key={category.id} className={styles.evaluation__card}>
                        <div className={styles.evaluation__card__header}>
                            <div className={styles.evaluation__card__header__badge}>
                                <span className={styles.evaluation__card__header__percentage}>
                                    {category.percentage}
                                </span>
                            </div>
                            <h3 className={styles.evaluation__card__header__title}>
                                {category.title}
                            </h3>
                        </div>

                        <button className={styles.evaluation__card__add}>
                            <Plus />
                            <span>Add Criteria</span>
                        </button>

                        <div className={styles.evaluation__card__list}>
                            {category.criteria.map((item) => (
                                <div key={item.id} className={styles.evaluation__card__item}>
                                    <div className={styles.evaluation__card__item__percentage}>
                                        {item.percentage}
                                    </div>
                                    <div className={styles.evaluation__card__item__content}>
                                        <span className={styles.evaluation__card__item__title}>
                                            {item.title}
                                        </span>
                                        <span className={styles.evaluation__card__item__description}>
                                            {item.description}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {category.id === 3 && (
                            <div className={styles.evaluation__card__actions}>
                                <button className={styles.evaluation__card__actions__button}>
                                    <Edit />
                                </button>
                                <button className={styles.evaluation__card__actions__button}>
                                    <Trash />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <footer className={styles.evaluation__footer}>
                <button className={styles.evaluation__footer__skip} onClick={onNext}>Skip</button>
                <button className={styles.evaluation__footer__next} onClick={onNext}>Next</button>
            </footer>
        </div>
    );
};
