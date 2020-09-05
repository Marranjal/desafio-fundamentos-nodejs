import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

// criar uma interface para definir o tipo das variaveis
interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    // Validar o valor do type
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }
    // Validar se o saldo é suficiente para a transação
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance');
    }

    // Aqui vamos criar a transação que vai lhe dar com o repository
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });
    return transaction;
  }
}

export default CreateTransactionService;
