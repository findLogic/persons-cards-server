import express from 'express';
import { faker } from '@faker-js/faker/locale/ru'; // Русские данные (можно убрать /locale/ru)
import cors from 'cors';

const app = express();
const PORT = 5000;

// Включение CORS (для фронтенда)
app.use(cors());

// Генерация 20 случайных пользователей
const generatePersons = (count = 20) => {
	const persons = [];
	const cities = [];
	const companies = [];
	for (let i = 1; i <= count; i++) {
		const city = faker.location.city();
		const company = faker.company.name();

		cities.push({ value: `val_${city}`, label: city });
		companies.push({ value: `val_${company}`, label: company });
		persons.push({
			id: i,
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			avatar: faker.image.avatar(),
			address: {
				street: faker.location.streetAddress(),
				city,
				country: faker.location.country(),
			},
			company,
			age: faker.number.int({ min: 18, max: 70 }),
			isActive: faker.datatype.boolean(),
			registeredAt: faker.date.past().toISOString(),
		});
	}
	return { persons, cities, companies };
};

let { persons, cities, companies } = generatePersons();

// Роуты
app.get('/api/cities', (req, res) => {
	res.json(cities);
});
app.get('/api/companies', (req, res) => {
	res.json(companies);
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
	const person = persons.find((p) => p.id === parseInt(req.params.id));
	if (!person)
		return res.status(404).json({ error: 'Пользователь не найден' });
	res.json(person);
});

// app.post('/api/persons', express.json(), (req, res) => {
// 	const newPerson = {
// 		id: persons.length + 1,
// 		...req.body,
// 		registeredAt: new Date().toISOString(),
// 	};
// 	persons.push(newPerson);
// 	res.status(201).json(newPerson);
// });

// app.delete('/api/persons/:id', (req, res) => {
// 	persons = persons.filter((p) => p.id !== parseInt(req.params.id));
// 	res.status(204).end();
// });

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}/api/persons`);
});
