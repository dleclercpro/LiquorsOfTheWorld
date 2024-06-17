import { createContext, ReactElement, useContext } from 'react';
import TimeDuration from '../../models/TimeDuration';
import { TimeUnit } from '../../types/TimeTypes';
import useServerTimer from '../../hooks/useServerTimer';

interface ITimerContext {
    isEnabled: boolean,
    duration: TimeDuration,
    startedAt: Date,
    time: TimeDuration,
    isRunning: boolean,
    isDone: boolean,
    start: () => void,
    stop: () => void,
    restart: () => void,
}

export const TimerContext = createContext<ITimerContext>({} as ITimerContext);



interface Props {
    children: ReactElement,
}

export const TimerContextProvider: React.FC<Props> = (props) => {
    const { children } = props;

    const timer = useTimerContext();
    
    return (
        <TimerContext.Provider value={timer}>
            {children}
        </TimerContext.Provider>
    );
}

export default function TimerContextConsumer() {
    return useContext(TimerContext);
}



const useTimerContext = () => {
    const timer = useServerTimer(new TimeDuration(1, TimeUnit.Second));

    return timer;
}