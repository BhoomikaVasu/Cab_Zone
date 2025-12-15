import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AttendanceCalendar = ({ isOpen, onClose, addToast, theme = 'dark' }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState({});
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';
    const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

    // Fetch drivers list
    useEffect(() => {
        if (isOpen) {
            fetchDrivers();
        }
    }, [isOpen]);

    const fetchDrivers = async () => {
        try {
            const response = await fetch(buildUrl('/api/drivers'));
            if (response.ok) {
                const data = await response.json();
                setDrivers(data || []);
            }
        } catch (error) {
            console.error('Failed to fetch drivers:', error);
        }
    };

    // Fetch attendance data for selected driver
    useEffect(() => {
        if (selectedDriver) {
            fetchAttendance();
        }
    }, [selectedDriver, currentDate]);

    const fetchAttendance = async () => {
        if (!selectedDriver) return;

        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const response = await fetch(
                buildUrl(`/api/attendance/${selectedDriver.id}?year=${year}&month=${month}`)
            );

            if (response.ok) {
                const data = await response.json();
                setAttendanceData(data || {});
            } else {
                setAttendanceData({});
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
            setAttendanceData({});
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getAttendanceStatus = (day) => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendanceData[dateKey];
    };

    const toggleAttendance = async (day) => {
        if (!selectedDriver) {
            addToast?.('Please select a driver first', 'error');
            return;
        }

        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentStatus = attendanceData[dateKey];
        const newStatus = currentStatus === 'present' ? 'absent' : currentStatus === 'absent' ? null : 'present';

        try {
            const response = await fetch(buildUrl('/api/attendance'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driverId: selectedDriver.id,
                    date: dateKey,
                    status: newStatus,
                }),
            });

            if (response.ok) {
                setAttendanceData(prev => ({
                    ...prev,
                    [dateKey]: newStatus,
                }));
                addToast?.(`Marked as ${newStatus || 'unmarked'}`, 'success');
            }
        } catch (error) {
            console.error('Failed to update attendance:', error);
            addToast?.('Failed to update attendance', 'error');
        }
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
        const days = [];
        const today = new Date();
        const isCurrentMonth =
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const status = getAttendanceStatus(day);
            const isToday = isCurrentMonth && today.getDate() === day;

            let bgColor = theme === 'light' ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800/50 hover:bg-slate-700/50';
            if (status === 'present') bgColor = 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30';
            if (status === 'absent') bgColor = 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';

            const textColor = status === 'present'
                ? 'text-emerald-600 dark:text-emerald-200'
                : status === 'absent'
                    ? 'text-red-600 dark:text-red-200'
                    : theme === 'light' ? 'text-slate-700' : 'text-gray-300';

            days.push(
                <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAttendance(day)}
                    disabled={!selectedDriver || loading}
                    className={`aspect-square rounded-lg border ${bgColor} ${isToday ? 'ring-2 ring-blue-400' : theme === 'light' ? 'border-slate-200' : 'border-white/10'
                        } flex items-center justify-center text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <div className="text-center">
                        <div className={textColor}>
                            {day}
                        </div>
                    </div>
                </motion.button>
            );
        }

        return days;
    };

    const changeMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (!isOpen) return null;

    const modalBg = theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-slate-900 to-slate-800';
    const textPrimary = theme === 'light' ? 'text-slate-800' : 'text-white';
    const textSecondary = theme === 'light' ? 'text-slate-600' : 'text-gray-300';
    const textMuted = theme === 'light' ? 'text-slate-500' : 'text-gray-400';
    const borderClass = theme === 'light' ? 'border-slate-200' : 'border-white/10';
    const bgMuted = theme === 'light' ? 'bg-slate-100' : 'bg-slate-800/50';
    const bgMutedLight = theme === 'light' ? 'bg-slate-50' : 'bg-slate-800/30';
    const inputClass = theme === 'light'
        ? 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500'
        : 'glass-input border-white/10 bg-white/5 text-white focus:border-emerald-400/60';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`w-full max-w-2xl ${modalBg} rounded-2xl shadow-2xl border ${borderClass} overflow-hidden`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="text-white" size={28} />
                                <div>
                                    <h2 className="text-xl font-bold text-white">Driver Attendance</h2>
                                    <p className="text-emerald-100 text-xs">Track monthly attendance records</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="text-white" size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Driver Selection */}
                        <div>
                            <label className={`block text-xs font-semibold ${textSecondary} mb-2`}>
                                Select Driver
                            </label>
                            <select
                                value={selectedDriver?.id || ''}
                                onChange={(e) => {
                                    const driver = drivers.find(d => d.id === e.target.value);
                                    setSelectedDriver(driver || null);
                                }}
                                className={`w-full py-2 px-3 rounded-lg border ${inputClass} text-sm outline-none`}
                            >
                                <option value="">-- Select a driver --</option>
                                {drivers.map(driver => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name || 'Unnamed'} ({driver.phone || driver.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Month Navigation */}
                        <div className={`flex items-center justify-between ${bgMuted} rounded-lg p-3`}>
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-white hover:bg-slate-50 shadow-sm' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
                            >
                                <ChevronLeft className={textMuted} size={20} />
                            </button>
                            <h3 className={`text-lg font-bold ${textPrimary}`}>
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <button
                                onClick={() => changeMonth(1)}
                                className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-white hover:bg-slate-50 shadow-sm' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
                            >
                                <ChevronRight className={textMuted} size={20} />
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
                                <span className={textSecondary}>Present</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50" />
                                <span className={textSecondary}>Absent</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-3 h-3 rounded ${bgMuted} border ${borderClass}`} />
                                <span className={textSecondary}>Not Marked</span>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className={`${bgMutedLight} rounded-lg p-3`}>
                            {/* Week day headers */}
                            <div className="grid grid-cols-7 gap-1.5 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className={`text-center text-[10px] font-semibold ${textMuted} uppercase`}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {renderCalendar()}
                            </div>
                        </div>

                        {!selectedDriver && (
                            <div className={`text-center ${textMuted} text-sm py-2`}>
                                Please select a driver to view and manage attendance
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AttendanceCalendar;
