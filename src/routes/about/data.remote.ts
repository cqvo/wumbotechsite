import { prerender } from '$app/server';
import yaml from 'js-yaml';
import resumeYaml from './resume.yaml?raw';

interface Organization {
	company: string;
	roles: Role[];
}

interface Role {
	title: string;
	description?: string;
	list?: string[];
	start: string;
	end: string;
}

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;
const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44;
const NOW = new Date();

const parseRoleDate = (dateStr: string): Date => {
	return dateStr === 'Present' ? NOW : new Date(dateStr);
};

const formatDate = (date: Date): string => {
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const calculateTenure = (startDate: Date, endDate: Date): string => {
	const tenureMs: number = Number(endDate) - Number(startDate);
	const years = Math.floor(tenureMs / MS_PER_YEAR);
	const months = Math.floor((tenureMs % MS_PER_YEAR) / MS_PER_MONTH);

	const yearsStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
	const monthsStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

	return [yearsStr, monthsStr].filter(Boolean).join(' ');
};

export const getResume = prerender(async () => {
	const orgs = yaml.load(resumeYaml) as Array<Organization>;

	return orgs.map((org) => {
		const roleDates = org.roles.map((role) => ({
			start: parseRoleDate(role.start),
			end: parseRoleDate(role.end),
			present: role.end === 'Present'
		}));

		const startDate = new Date(Math.min(...roleDates.map((d) => d.start.getTime())));
		const endDate = new Date(Math.max(...roleDates.map((d) => d.end.getTime())));
		const hasPresent = roleDates.some((role) => role.present);

		return {
			...org,
			start: formatDate(startDate),
			end: hasPresent ? 'Present' : formatDate(endDate),
			tenure: calculateTenure(startDate, endDate)
		};
	});
});
