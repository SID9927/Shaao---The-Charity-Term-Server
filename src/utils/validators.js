export function validateEntryPayload(payload) {
    const errors = [];
  
    const { fullName, dob, mobile, email, address, amount, transactionId, age } = payload;
  
    if (!fullName || fullName.trim().length < 2) errors.push('Full name is required.');
    if (!dob || isNaN(Date.parse(dob))) errors.push('Valid DOB is required.');
    if (typeof age !== 'number' || age < 0 || age > 120) errors.push('Calculated age is invalid.');
    if (!mobile || !/^\d{10}$/.test(mobile)) errors.push('Mobile must be 10 digits.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
    if (!address || address.trim().length < 5) errors.push('Address is required.');
    if (![10, 30, 50].includes(Number(amount))) errors.push('Amount must be 10, 30, or 50.');
    if (!transactionId || transactionId.trim().length < 4) errors.push('Transaction ID is required.');
  
    return errors;
  }
  
  export function calculateAge(dobStr) {
    const d = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age;
  }