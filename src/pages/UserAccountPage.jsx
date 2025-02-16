import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // Importing Font Awesome stars


export default function UserAccountPage() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="bg-gradient-to-b from-primarydark to-primarylight p-4 md:mx-16">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Welcome {user.name}</h1>
        
      </header>
      <section className="mb-8">
  <h2 className="text-2xl font-semibold mb-4">User Credentials</h2>
  <p className="font-semibold flex items-center">
     User Name: {user.name}
  </p>
  <p className="flex items-center">
     User Email: {user.email}
  </p>
</section>

<section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About the App</h2>
        <p className="text-lg text-gray-700">
          Welcome to Occasio! We strive to provide the best user experience with features that help you manage your tasks efficiently. Whether you're looking for a way to stay organized, track events, or just enjoy a smooth interface, we've got you covered. Explore our app and take full advantage of its capabilities!
        </p>
      </section>
      {/* About the App Section */}
      

      {/* Terms & Conditions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
        <p className="text-lg text-gray-700">
          By using this app, you agree to our terms and conditions. Please read the following terms carefully before using our service. We reserve the right to modify or update these terms at any time. If you continue using the app after such modifications, you agree to be bound by the updated terms.
        </p>
        <ul className="list-disc pl-6 mt-4 text-gray-700">
          <li>Ensure your data is accurate and complete.</li>
          <li>Respect others' privacy and data security.</li>
          <li>Do not misuse the app for unlawful activities.</li>
          <li>We are not responsible for any technical issues that arise from using the app.</li>
        </ul>
      </section>

      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        <div className="space-y-4">
          {[ 
            { name: "John Doe", review: "The app is fantastic! It has everything I need to stay organized, and the UI is very intuitive. Highly recommend!", stars: 5 },
            { name: "Jane Smith", review: "A must-have tool for anyone who needs to manage their day-to-day tasks. I love the clean design and ease of use.", stars: 4 },
            { name: "Sarah Lee", review: "I’ve been using this app for a few months now, and it has helped me stay on top of my work and personal life. The updates keep getting better!", stars: 5 }
          ].map((review, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{review.name}</p>
                <p className="text-gray-700">"{review.review}"</p>
              </div>
              <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                {[...Array(review.stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                {[...Array(5 - review.stars)].map((_, i) => (
                  <FaStar key={i} className="text-gray-300" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
