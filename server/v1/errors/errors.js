class AppError extends Error {
    constructor(message, name = "AppError") {
        super(message);
        this.name = name;
    }
}

class ValidationError extends AppError {
    constructor(message = "Dados inválidos") {
        super(message, "ValidationError");
    }
}

class NotFoundError extends AppError {
    constructor(message = "Recurso não encontrado") {
        super(message, "NotFoundError");
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Não autorizado") {
        super(message, "UnauthorizedError");
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Proibido") {
        super(message, "ForbiddenError");
    }
}

class ConflictError extends AppError {
    constructor(message = "Conflito de dados") {
        super(message, "ConflictError");
    }
}

class SendEmailError extends AppError {
    constructor(message = "Erro ao enviar e-mail") {
        super(message, "SendEmailError");
    }
}

export {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    SendEmailError
};