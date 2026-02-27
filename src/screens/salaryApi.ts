import axios, { CancelTokenSource } from 'axios';

// export const BASE_URL = 'https://3rbl4zn1-1234.inc1.devtunnels.ms/api';  // local

export const BASE_URL = 'https://payrollpro-ubmm.onrender.com/api'; // live

const APPLICATION_KEY = 'payroll_pro_2026';

export const apiCall = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  timeoutErrorMessage: `We're having a bit of a snag connecting to the server. Let's try again later.`,
});

apiCall.interceptors.request.use(async (config) => {

  config.headers['x-payroll-key'] = APPLICATION_KEY;

  return config;
});

apiCall.interceptors.response.use(
  function (response) {
    console.log(
      'success::',
      `${response.config.baseURL}${response.config.url}`,
      response.config.data,
    );
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      console.warn('In interceptor', error.stack);
      if (error.response) {
        return Promise.reject({
          code: error.response.status,
          message: error.response.data.message,
        });
      } else {
        return Promise.reject({
          code: 999,
          message: error.message,
          data: error.code,
        });
      }
    } else {
      return Promise.reject(error);
    }
  },
);


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const activeRequests = new Map<string, CancelTokenSource>();

const cancelPreviousRequest = (key: string) => {
  const existingRequest = activeRequests.get(key);
  if (existingRequest) {
    existingRequest.cancel('Request cancelled due to new request');
    activeRequests.delete(key);
  }
};

const createCancelToken = (key: string) => {
  cancelPreviousRequest(key);
  const source = axios.CancelToken.source();
  activeRequests.set(key, source);
  return source;
};

export const fetchAllEmployees = async () => {
  const source = createCancelToken('fetchAllEmployees');
  try {
    const { data } = await apiCall.get('/employees', {
      cancelToken: source.token,
    });
    if (!data.success) throw new Error('Employees fetch failed');
    return data.data;
  } finally {
    activeRequests.delete('fetchAllEmployees');
  }
};

export const fetchSalaryByDay = async (date: string) => {
  const source = createCancelToken('fetchSalaryByDay');
  
  try {
    const { data } = await apiCall.post(
      '/salary/all-by-date',
      { date },
      { cancelToken: source.token }
    );
    
    if (!data.success) throw new Error('Salary fetch failed');
    
    const rows = data.data || [];
    const total = rows.reduce((s: number, r: any) => s + Number(r.salary_amount || 0), 0);

    return {
      mode: 'day',
      date,
      data: rows,
      totalSalary: total,
      records: rows.length,
    };
  } finally {
    activeRequests.delete('fetchSalaryByDay');
  }
};

export const fetchSalaryByRange = async (params: {
  employee_id: number;
  start_date: string;
  end_date: string;
}) => {
  const source = createCancelToken('fetchSalaryByRange');
  
  try {
    const { data } = await apiCall.post('/salary/between-dates', params, {
      cancelToken: source.token,
    });
    
    if (!data.success) throw new Error('Range fetch failed');
    return { ...data, mode: 'range' };
  } finally {
    activeRequests.delete('fetchSalaryByRange');
  }
};

export const fetchSalaryAllTime = async (employee_id: number) => {
  const source = createCancelToken(`fetchSalaryAllTime_${employee_id}`);
  
  try {
    const { data } = await apiCall.get(`/salary/user/${employee_id}`, {
      cancelToken: source.token,
    });
    
    if (!data.success) throw new Error('All time fetch failed');
    return { ...data, mode: 'employee' };
  } finally {
    activeRequests.delete(`fetchSalaryAllTime_${employee_id}`);
  }
};

export const fetchSalaryThisWeek = async (employee_id: number) => {
  const source = createCancelToken(`fetchSalaryThisWeek_${employee_id}`);
  
  try {
    const { data } = await apiCall.get(`/salary/this-week/${employee_id}`, {
      cancelToken: source.token,
    });
    
    if (!data.success) throw new Error('This week fetch failed');
    return { ...data, mode: 'employee' };
  } finally {
    activeRequests.delete(`fetchSalaryThisWeek_${employee_id}`);
  }
};

export const fetchSalaryByEmployee = async (params: {
  employee_id: number;
  period: 'all' | 'thisweek' | 'custom';
  start_date?: string;
  end_date?: string;
}) => {
  if (params.period === 'thisweek') {
    return fetchSalaryThisWeek(params.employee_id);
  }
  if (params.period === 'custom') {
    return fetchSalaryByRange({
      employee_id: params.employee_id,
      start_date: params.start_date!,
      end_date: params.end_date!,
    });
  }
  return fetchSalaryAllTime(params.employee_id);
};

export const cancelAllRequests = () => {
  activeRequests.forEach((source) => {
    source.cancel('Component unmounted or cleanup');
  });
  activeRequests.clear();
};
