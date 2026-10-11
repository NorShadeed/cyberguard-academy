import React, { useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseRunner from './CourseRunner';
import { getAllModules } from '../../data/ModuleRegistry'; // FIXED: Use dynamic registry
import { AuthContext } from '../../features/auth/AuthContext';
import { useProgress } from '../../hooks/useProgress';

const CourseRunnerPage = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    // Refactored: Use Centralized Logic Hook
    const { finishActivity } = useProgress();

    // Find the course and phase data based on the URL param
    const { course, phase } = useMemo(() => {
        const modules = getAllModules(); // Get dynamic modules
        for (const c of modules) {
            const p = c.phases.find(ph => String(ph.phaseId) === String(phaseId));
            if (p) {
                return { course: c, phase: p };
            }
        }
        return { course: null, phase: null };
    }, [phaseId]);

    const handleClose = () => {
        // Go back to training lobby
        navigate('/training');
    };

    const handleComplete = async () => {
        // Centralized Save
        await finishActivity(phaseId, 'module', 100);
        navigate('/training');
    };

    const currentPhaseIndex = course ? course.phases.findIndex(p => p.phaseId === phase.phaseId) : -1;
    const nextPhase = (course && currentPhaseIndex !== -1 && currentPhaseIndex < course.phases.length - 1)
        ? course.phases[currentPhaseIndex + 1]
        : null;
    const hasNextPhase = !!nextPhase;

    const handleNextPhase = async () => {
        // Centralized Save
        await finishActivity(phaseId, 'module', 100);
        if (nextPhase) {
            navigate(`/training/run/${nextPhase.phaseId}`);
        }
    };

    const saveProgress = async () => {
        // Centralized Save without navigation
        return await finishActivity(phaseId, 'module', 100);
    };

    if (!phase) {
        return (
            <div style={{ padding: 50, color: '#fff', textAlign: 'center' }}>
                <h1>Module Not Found</h1>
                <p>Invalid Phase ID: {phaseId}</p>
                <button onClick={handleClose}>Return to Training</button>
            </div>
        );
    }

    return (
        <CourseRunner
            course={course}
            phase={phase}
            onClose={handleClose}
            onComplete={handleComplete}
            onNextPhase={handleNextPhase}
            saveProgress={saveProgress}
            hasNextPhase={hasNextPhase}
        />
    );
};

export default CourseRunnerPage;
