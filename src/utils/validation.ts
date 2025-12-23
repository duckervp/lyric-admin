const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errorMsg = {
  viVN: {
    nameRequired: "Name is required!",
    nameLength: "Name must be at least 3 characters!",
    emailRequired: "Email is required!",
    emailFormat: "Invalid email format!",
    passwordRequired: "Password is required!",
    passwordLength: "Password must be at least 6 characters!",
    currentPasswordRequired: "Current password is required!",
    confirmPasswordRequired: "Confirm password is required!",
    confirmPasswordNotMatch: "Passwords do not match!",
    usernameRequired: "Username is required!",
    usernameLength: "Username must be at least 3 characters!"
  },
  enUS: {
    nameRequired: "Tên là bắt buộc!",
    nameLength: "Tên phải có ít nhất 3 ký tự!",
    emailRequired: "Email là bắt buộc!",
    emailFormat: "Định dạng email không hợp lệ!",
    passwordRequired: "Mật khẩu là bắt buộc!",
    passwordLength: "Mật khẩu phải có ít nhất 6 ký tự!",
    currentPasswordRequired: "Mật khẩu hiện tại là bắt buộc!",
    confirmPasswordRequired: "Xác nhận mật khẩu là bắt buộc!",
    confirmPasswordNotMatch: "Mật khẩu xác nhận không khớp!",
    usernameRequired: "Tên đăng nhập là bắt buộc!",
    usernameLength: "Tên đăng nhập phải có ít nhất 3 ký tự!"
  }
}

type Locale = keyof typeof errorMsg

export const validateField = (
  name: string,
  value: string | boolean,
  required: boolean,
  state: Record<string, any>,
  locale: Locale = "enUS",
): string => {
  switch (name) {
    case "name":
      if (!value && required) return errorMsg[locale].nameRequired
      if (typeof value === "string" && value.length > 0 && value.length < 3)
        return errorMsg[locale].nameLength
      break

    case "email":
      if (!value && required) return errorMsg[locale].emailRequired
      if (typeof value === "string" && !emailRegex.test(value))
        return errorMsg[locale].emailFormat
      break

    case "password":
      if (!value && required) return errorMsg[locale].passwordRequired
      if (typeof value === "string" && value.length > 0 && value.length < 6)
        return errorMsg[locale].passwordLength
      break

    case "currentPassword":
      if (!value && required)
        return errorMsg[locale].currentPasswordRequired
      break

    case "confirmPassword":
      if (!value && required)
        return errorMsg[locale].confirmPasswordRequired
      if (value !== state.password)
        return errorMsg[locale].confirmPasswordNotMatch
      break

    case "username":
      if (!value && required)
        return errorMsg[locale].usernameRequired
      if (typeof value === "string" && value.length > 0 && value.length < 3)
        return errorMsg[locale].usernameLength
      break

    default:
      return ""
  }

  return ""
}

