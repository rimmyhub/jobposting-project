export interface Job {
  companyTitle: string;
  companyId: number;
  title: string;
  career: string;
  salary: string;
  education: string;
  workType: string;
  workArea: string;
  content: string;
  dueDate: string;
}

export interface Company {
  email: string;
  title: string;
  password: string;
  introduction: string;
  website: string;
  address: string;
  business: string;
  employees: string;
  image: string;
}

// {
//   companyId: number;
//   password?: string;
//   title?: string;
//   introduction?: string;
//   business?: string;
//   employees?: string | number;
//   image?: string;
//   website: string;
//   address: string;
// }[] = [];
