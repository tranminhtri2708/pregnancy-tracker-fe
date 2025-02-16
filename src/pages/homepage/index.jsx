import { useState } from "react";

import Header from "../../components/header";
import Footer from "../../components/footer";

const PregnancyHomepage = () => {
  const [darkMode] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const pregnancyStages = [
    {
      week: 1,
      description:
        "In the first week, the mother is not actually pregnant yet. Calculating the pregnancy timeline from the first day of the last menstrual period allows doctors to estimate the due date accurately.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 2,
      description:
        "In the second week, if conception occurs at the end of this week, the chances of success are very high. Doctors will calculate your pregnancy from the first day of your last menstrual period.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 3,
      description:
        "The third week of pregnancy marks the beginning of conception. At this stage, the fertilized egg, or zygote, travels to the uterus and implants itself as a tiny cluster of cells known as the blastocyst.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 4,
      description:
        "Week 4 marks a period of rapid embryonic growth as the foundation for the body's organs and structures begins to form. This is also the ideal time for the mother to schedule her first prenatal check-up.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/4-weeks_727110898-300x300.png",
    },
    {
      week: 5,
      description:
        "The main developments in week 5 include the formation of the nose, mouth, and ears. The baby’s head is disproportionately large, and dark spots begin to appear where the eyes and nostrils will form. The fetus's size has not changed significantly height: 0.2cm.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/5-weeks_1482584441-300x300.png",
    },
    {
      week: 6,
      description:
        "Week 6 of pregnancy is when the baby's eyes, nose, mouth, and ears begin to form, along with a tiny heart beating at nearly twice the mother's rate. Height: 0.4 cm.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/6-weeks_1482584444-300x300.png",
    },
    {
      week: 7,
      description:
        "At 7 weeks of pregnancy, the baby's webbed fingers and toes begin to form, and the tail gradually disappears. The mother should also learn ways to ease morning sickness.  Height: 1 cm.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/7-weeks-1482584438-300x300.png",
    },
    {
      week: 8,
      description:
        "At 8 weeks of pregnancy, the baby's shape has developed relatively fully and is ready to gain weight in the coming months. The mother should learn about proper nutrition to support the baby's growth.  Height: 1.6 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/8-weeks_1482584405-300x300.png",
    },
    {
      week: 9,
      description:
        "Week 9 marks the beginning of the fetal stage. During an ultrasound, the mother can see the baby's tissues and organs developing and maturing rapidly.  Height: 2.2 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/9-weeks_293546375-300x300.png",
    },
    {
      week: 10,
      description:
        "At 10 weeks of pregnancy, the baby has nearly fully developed body parts like an adult and moves constantly with kicks, wriggling, twisting, and turning.  Height: 3 cm",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/10-weeks_293546450-300x300.png",
    },
    {
      week: 11,
      description:
        "At week 11, the baby's face is becoming more defined: the eyes have moved from the sides to the center, and the ears are now in their proper position. Nerve cells are also multiplying rapidly. The mother should be mindful of constipation during this stage.  Height: 4.1 cm and Weight: 0.01 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/11-weeks_293546396-300x300.png",
    },
    {
      week: 12,
      description:
        "At 12 weeks of pregnancy, the baby's body is now more proportionate to the head, neural connections are forming rapidly, and the baby has developed a sucking reflex.  Height: 5.4 cm and Weight: 0.018 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/12-weeks_293546420-300x300.png",
    },
    {
      week: 13,
      description:
        "At 13 weeks of pregnancy, the baby has grown significantly in both size and internal organs. The baby can now squint, frown, make facial expressions, and urinate. Ultra-fine lanugo hair begins to develop, covering the baby's body.  Height: 7.4 cm and Weight: 0.025 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/13-weeks_293545115-300x300.png",
    },
    {
      week: 14,
      description:
        "At this week, the baby's legs have grown longer than the arms, and all joints and limbs can move. Although the eyelids remain closed, the baby can sense light. The mother will soon be able to find out the baby's gender. Height: 8.5 cm and Weight: 0.078 - 0.104 kg ",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/14-weeks_293546378-300x300.png",
    },
    {
      week: 15,
      description:
        "This week, the baby is developing and practicing many reflexes, such as breathing movements and visual responses. Height: 10.1 cm and Weight: 0.099 - 0.132 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/15-weeks_727111789-300x300.png",
    },
    {
      week: 16,
      description:
        "This week, the baby's legs have grown longer, and the head is more upright than before. The scalp plates have started to settle, toenails are beginning to form, and the baby can even kick the mother's belly. Height: 11.6 cm and Weight: 0.124 - 0.166 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/16-weeks-1-300x300.png",
    },
    {
      week: 17,
      description:
        "At 17 weeks of pregnancy, the baby's heart is now regulated by the brain, so it no longer beats randomly. The heart rate is about 140-150 beats per minute, twice as fast as an adult's.  Height: 12 cm and Weight: 0.155 - 0.207 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/17-weeks-1-300x300.png",
    },
    {
      week: 18,
      description:
        "This week, the baby's arms and legs are proportionate to the body. The kidneys continue to produce urine, and hair begins to grow on the scalp. A protective waxy coating called **vernix caseosa** is forming on the baby's skin. Height: 14.2 cm and Weight: 0.192 - 0.255 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/18-weeks_293546339-300x300.png",
    },
    {
      week: 19,
      description:
        "This week, the baby begins swallowing more amniotic fluid, which helps develop the digestive system. The baby also starts producing **meconium** (first stool). Height: 15.3 cm and Weight: 0.235 - 0.313 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/19-weeks_293545064-300x300.png",
    },
    {
      week: 20,
      description:
        "This week, the baby can move gently, kick, and nudge. Since the amniotic sac is still spacious, the baby will twist and tumble more frequently. Height: 25.6 cm and Weight: 0.286 - 0.380 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/20-weeks_1482584372-300x300.png",
    },
    {
      week: 21,
      description:
        "At week 21, the baby is starting to resemble a newborn. The lips, eyelids, and eyebrows are more defined, and tiny tooth buds are forming beneath the gums. The baby may also experience hiccups. Height: 26.7 cm and Weight: 0.345 - 0.458 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/21-weeks_293545046-300x300.png",
    },
    {
      week: 22,
      description:
        "At week 22, the blood vessels in the baby's lungs are developing to prepare for breathing. The baby's ears are becoming more sensitive to sounds in preparation for the outside world. Height: 27.8 cm and Weight: 0.412 - 0.548 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/22-weeks_458875654-300x300.png",
    },
    {
      week: 23,
      description:
        "At week 23, the baby's organs and bones are visible through the thin, translucent skin, but changes will soon occur. The mother may experience insomnia, leg cramps, or heartburn. Height: 28.9 cm and Weight: 0.489 - 0.650 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/23-weeks_293546480-300x300.png",
    },
    {
      week: 24,
      description:
        "This week, the baby is no longer thin but has started accumulating fat, causing the wrinkled skin to smooth out, making the baby look more like a newborn. At this stage, the mother should consider a gestational diabetes test .Height: 30 cm and Weight: 0.576 - 0.765 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/24-weeks_458875597-300x300.png",
    },
    {
      week: 25,
      description:
        "At week 25, the network of nerves in the baby's ears has developed further, making them more sensitive. The baby can now hear the parents' voices. Height: 34.6 cm and Weight: 0.673 - 0.894 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/25-weeks-458875555-300x300.png",
    },
    {
      week: 26,
      description:
        "At 26 weeks, the baby has more brain tissue and increasingly developed senses, with the brain becoming very active. The baby follows a regular sleep-wake cycle, can open and close their eyes, and even suck their thumb. Height: 35.6 cm and Weight: 0.78 - 1.038 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/26-weeks_1482584366-300x300.png",
    },
    {
      week: 27,
      description:
        "At 27 weeks, the baby can see dim light through the mother's womb. The baby can recognize your and your partner's voices and may start hiccuping. Height: 36.6 cm and Weight: 0.898 - 1.196 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/27-weeks_293545130-300x300.png",
    },
    {
      week: 28,
      description:
        "At week 28, the baby's eyes continue to develop, muscles are getting stronger, and the lungs are now capable of breathing air. Notably, the brain is developing millions of neurons. The mother should be aware of **preeclampsia** during this stage. Height: 37.6 cm and Weight: 1.026 - 1.368 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/28-weeks-1-300x300.png",
    },
    {
      week: 29,
      description:
        "This week, the baby will kick more and become more active as they grow stronger. The baby now reacts to various stimuli, including movement, sound, light, and even the food the mother eats.  Height: 38.6 cm and Weight: 1.165 - 1.554 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/29-weeks_293545127-300x300.png",
    },
    {
      week: 30,
      description:
        "The baby can now turn their head from side to side. Arms, legs, and the body are becoming fuller as essential fat begins to accumulate under the skin. Height: 39.9 cm and Weight: 1.313 - 1.753 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/30-weeks_458875693-300x300.png",
    },
    {
      week: 31,
      description:
        "At this stage, the baby has toenails, fingernails, hair, and fine lanugo. The skin is soft and smooth as the baby is getting rounder. The baby is developing all five senses, sleeping more, and practicing facial expressions. Height: 41.1 cm and Weight: 1.470 - 1.964 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/31-weeks-1-300x300.png",
    },
    {
      week: 32,
      description:
        "At week 32, the baby's skin is no longer wrinkled, and the skeleton is getting stronger. The skull bones remain flexible and slightly overlapping to help the baby pass through the birth canal. The mother may start experiencing back pain. Height: 42.4 cm and Weight: 1.635 - 2.187 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/32-weeks_458875585-300x300.png",
    },
    {
      week: 33,
      description:
        "The baby is behaving more like a newborn, closing their eyes while sleeping and opening them when awake. As the uterine wall thins, light can pass through, helping the baby distinguish between day and night. The mother should be mindful of **varicose veins** during pregnancy. Height: 43.7 cm and Weight: 1.807 - 2.419 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/33-weeks_293545121-300x300.png",
    },
    {
      week: 34,
      description:
        "At 34 weeks, the white waxy coating (vernix caseosa) that protects the baby's skin from amniotic fluid is thickening, helping to lubricate for birth preparation. Height: 45 cm and Weight: 1.985 - 2.659 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/34-weeks-1-300x300.png",
    },
    {
      week: 35,
      description:
        "The baby's kidneys are fully developed, and the liver can process some waste. Most of the baby's physical development is complete. In the coming weeks, the baby will continue to gain weight and shift position in preparation for birth. Height: 46.2 cm and Weight: 2.167 - 2.904 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/35-weeks_293545061-300x300.png",
    },
    {
      week: 36,
      description:
        "At 36 weeks, the baby's skull and most other bones, including cartilage, are still soft. Many organs are fully developed, preparing the baby for life outside the womb. Height: 47.4 cm and Weight: 2.352 - 3.153 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/36-weeks-1-300x300.png",
    },
    {
      week: 37,
      description:
        "At this stage, the uterus is becoming cramped, so the baby kicks less than before, but you can still feel movements. If the baby is unusually quiet, you should see a doctor immediately for a check-up. Height: 48.6 cm and Weight: 2.537 - 3.403 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/37-weeks_293545148-300x300.png",
    },
    {
      week: 38,
      description:
        "The baby continues to accumulate fat under the skin to help regulate body temperature after birth. Boys are usually slightly heavier than girls. The outer layers of skin are shedding and being replaced by new skin underneath. Height: 49.8 cm and Weight: 2.723 - 3.652 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/38-weeks_293546369-300x300.png",
    },
    {
      week: 39,
      description:
        "Week 39: The baby's skull bones are not yet fused and can slightly overlap to ease passage through the birth canal. Mom should pay attention to uterine contractions. Height: 50.7 cm and Weight: 2.905 - 3.897 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/39-weeks_293545079-300x300.png",
    },
    {
      week: 40,
      description:
        "Week 40: The baby has grown too big to stay in the womb for much longer. If there are no signs of labor in the coming week, the doctor may consider induction to ensure the safety of both mother and baby. Height: 51.2 cm and Weight: 3.084 - 4.135 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/40-weeks_293546468-300x300.png",
    },
  ];

  const healthTips = [
    {
      title: "Nutrition",
      content: "Eat a balanced diet rich in folic acid and vitamins",
    },
    {
      title: "Exercise",
      content: "Regular gentle exercise like walking and prenatal yoga",
    },
    { title: "Rest", content: "Ensure 8 hours of quality sleep each night" },
    {
      title: "Hydration",
      content: "Drink at least 8-10 glasses of water daily",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      <Header />
      <header className="relative h-[600px] overflow-hidden">
        <img
          src="https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-me-va-be.jpeg"
          alt="Pregnant woman"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-50 dark:to-gray-900">
          <div className="container mx-auto px-6 pt-32">
            <h2 className="text-5xl font-bold mb-4">
              Momly, Your Pregnancy Companion
            </h2>
            <p className="text-xl max-w-2xl">
              Pregnancy is a miraculous and meaningful journey, marking the
              formation and development of a new life. Throughout the 40 weeks
              of pregnancy, both the mother's body and the baby undergo
              significant changes, from a tiny cell to a fully developed baby
              ready to be born.
            </p>
          </div>
        </div>
      </header>

      {/* My pregnancy week by week */}
      <section className="container mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold mb-8">My pregnancy week by week</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {pregnancyStages.map((stage) => (
            <div
              key={stage.week}
              className="p-4 min-w-[150px] rounded-xl shadow-lg hover:transform hover:scale-105 transition-all cursor-pointer bg-white dark:bg-gray-800"
              onClick={() =>
                setSelectedWeek(stage.week === selectedWeek ? null : stage.week)
              }
            >
              <img
                src={stage.image}
                alt={`Week ${stage.week}`}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h4 className="text-lg font-bold mb-1 text-center">
                Week {stage.week}
              </h4>
            </div>
          ))}
        </div>
        {selectedWeek && (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h4 className="text-2xl font-bold mb-2">Week {selectedWeek}</h4>
            <p>
              {
                pregnancyStages.find((stage) => stage.week === selectedWeek)
                  .description
              }
            </p>
          </div>
        )}
      </section>

      {/* Health Tips */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8">Health & Wellness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthTips.map((tip, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-rose-100 dark:bg-gray-700 hover:shadow-lg transition-all"
              >
                <h4 className="text-xl font-bold mb-2">{tip.title}</h4>
                <p>{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PregnancyHomepage;
