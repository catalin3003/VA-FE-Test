import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.fullScreenLoader}>
            <div className={styles.loadingBar}></div>
            <div className={styles.backgroundImages}>
                <div className={styles.backgroundImage}></div>
                <div className={styles.backgroundImage}></div>
                <div className={styles.backgroundImage}></div>
            </div>
        </div>
    );
}
