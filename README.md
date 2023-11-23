Tutora
Personalized AI tutor for every student.

With the rise of the popularity of AI, it is important that students get familiar with the tools that will be extremely useful when they enter the job market.
By having a platform that allows students to utilize AI in a way that encourages the student to use the tools given to them in a productive way that benefits the student and doesn't replace the teachers altogether. The AI platform allows to remember the conversations that the student had with the
assistant so that the next time the same student logs in, the tutor knows what kind of questions to expect from the student, and the student is able to receive the help they need without wasting a lot of time to get their point across.

Running the project
The frontend of the project is hosted on AWS Amplify. There are two main pages. The Login/signup page which allows the users to sign up or login depending on if they have an account. The signup and login process is handled by Cognito.
After the users log in, they are presented with the chat page where they can interact with the AI. The backend is hosted on an EC2 instance which allows us to easily scale the application as needed according to the demand. The users interact with OpenAI's chat-gpt 3.5 turbo model 
which allows the students to receive the help they need without being too advanced for the level that they need. 
