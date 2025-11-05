export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:5003";
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log('Making API request to:', fullUrl, 'with options:', options);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status, 'ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new Error(errorData.message || errorData || "Something went wrong");
    }

    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => password.length >= 6;
export const validateUsername = (username) => username.length >= 3;
export const validateConfirmPassword = (password, confirmPassword) =>
  password === confirmPassword;