const logger = {
  info: (...data: any[]) => {
    console.log(
      "%cINFO",
      "padding:1px;background:blue;color:white;font-weight:bold",
      ...data
    );
  },
  success: (...data: any[]) => {
    console.log(
      "%cSUCCESS",
      "padding:1px;background:green;color:white;font-weight:bold",
      ...data
    );
  },
  warn: (...data: any[]) => {
    console.log(
      "%cINFO",
      "padding:1px;background:orange;color:white;font-weight:bold",
      ...data
    );
  },
  error: (...data: any[]) => {
    console.log(
      "%cERROR",
      "padding:1px;background:red;color:white;font-weight:bold",
      ...data
    );
  },
};

export { logger };
