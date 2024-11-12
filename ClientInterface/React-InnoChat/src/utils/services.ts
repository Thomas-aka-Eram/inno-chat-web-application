export const baseUrl = "http://localhost:5000/api";


export const postRequest = async (url: string, body: any, isFile = false): Promise<any> => {
  const options: RequestInit = {
    method: "POST",
  };

  if (isFile) {
    options.body = body;
  } else {
    options.headers = {
      "Content-Type": "application/json"
    };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    let message = data?.message ? data.message : data;
    return { error: true, message };
  }

  return data;
};



export const getRequest = async(url:string) =>{
  const response = await fetch(url);
  const data = await response.json();
  if(!response.ok){
    let message = "Error Occurs!";

    if(data?.message){
      message = data.message;
    }else{
      message = data;
    }

    return {error:true, message};
  }

  return data;
}

export const putRequest = async (url: string, body: any): Promise<any> => {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    let message = data?.message ? data.message : data;
    return { error: true, message };
  }

  return data;
};

export const deleteRequest = async (url: string, body: any): Promise<any> => {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    let message = data?.message ? data.message : data;
    return { error: true, message };
  }

  return data;
};




