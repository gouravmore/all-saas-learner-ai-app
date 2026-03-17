export const getAssetUrl = (filename, type = "mechanics_images") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const getAssetAudioUrl = (filename, type = "mechanics_audios") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const Apple = `70d97e24-abf4-42af-8aa7-779801541372.png`;
export const apAudio = "a1117f70-6dc0-4210-b794-b7d55abfa5c3.mp3";
export const pleAudio = "1b041226-090c-4e4b-bfe4-e9b432e6001a.mp3";
export const appleAudio = "b2a39def-9a1e-4ec3-9793-03d79e3d3d52.mp3";

export const happyImg = "408257c8-af6e-4718-a8a5-be070a195d1e.png";
export const hapAudio = "3503a6ac-800d-4477-85ee-146e6642bcb1.mp3";
export const pyAudio = "d71e9bec-a8aa-4e35-83f0-44bd8a3549bd.mp3";
export const happyAudio = "5992042b-9bf0-4feb-a0e3-b6eb80100c32.mp3";

export const pencilImg = "dfa309a9-713b-4726-b822-d0423c033175.png";
//export const penAudio = "3dc789a8-2cbe-4a92-83f1-b41da07ba70e.mp3";
export const cilAudio = "3de1d37d-8b6a-436a-b36f-5843fd6f87c7.mp3";
export const pencilAudio = "1f5163a9-bd4a-4f7b-8625-22c636c6b300.mp3";

export const TigerNewImg = "c6513466-596d-4a47-abff-0c8202c0dc5d.png";
export const tiAudio = "1b38868a-ce4b-491e-b9c6-56a95046db50.mp3";
export const gerAudio = "4e877701-5226-412f-a7b6-382af4e8632b.mp3";
export const tigerAudio = "5f5c440d-f421-4ae5-bc28-d4fb98ad7578.mp3";

export const RocketNewImg = "80b22d32-621f-4f16-b1a2-f428b35c05ef.png";
export const Rock = "73ef03fc-61d5-479d-8ca0-450492a145f0.mp3";
export const Et = "f7053bb9-285f-476c-a525-f0f41869fd49.mp3";
export const RocketS = "dfff31f2-ac9c-4346-a9f7-7042e82d8888.mp3";

export const Basket = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const Bas = "631cf215-4282-4e62-b116-85cd92d6201e.mp3";
//export const Ket = "e095247f-d16a-40bc-8c86-dc9da7a7cdf6.mp3";
export const BasketS = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

export const DinnerNewImg = "d8ae7f85-9262-434b-a813-5dd07780f7f0.png";
export const dinAudio = "2125b9e8-43b1-42b6-89ea-1c31bc226e5b.mp3";
export const nerAudio = "81c7662b-d041-4e3b-82bc-9ce92d203c86.mp3";
export const dinnerAudio = "c15c8f2b-6d25-4731-a9df-02c2b8a76bb7.mp3";

export const WindowNewImg = "2fc1a46c-7a7b-44de-8f2d-da5a69b6793d.png";
export const winAudio = "8dd8755b-a98c-4d9a-862b-b2663e128fcd.mp3";
export const dowAudio = "722fed44-3add-453e-a8eb-9fa0c1fb8359.mp3";
export const windowAudio = "f9d1fda0-c246-469e-9ea7-c84b646acc98.mp3";

export const MagnetNewImg = "0b2fed44-a12c-4aef-86bb-71aaa9beafb0.png";
export const magAudio = "c265a218-6ba9-427e-b8b5-021d96cf34c5.mp3";
export const netAudio = "680920d5-9f10-4e5c-94b4-892eb8a73639.mp3";
export const magnetAudio = "220a198a-a138-4f29-ac35-382bb58e40df.mp3";

export const TennisNewImg = "171b7425-6f7a-4fe8-8e5c-44f1d6704734.png";
export const tenAudio = "fc2b08a8-d61f-4a23-9ebf-2bf7ca50090e.mp3";
export const nisAudio = "c01a51af-3a03-49ef-94ac-ebd5c4815fd5.mp3";
export const tennisAudio = "2af8a1d3-f69f-4828-9c0c-5d7897892df8.mp3";

export const PictureNewImg = "53373c82-fc09-4fd7-8a86-de9c521697ca.png";
export const picAudio = "88eea860-1980-4cfc-95d4-14b8e97552ff.mp3";
export const tureAudio = "e08d2e91-70b9-41d8-9b2e-ae316cbd41b7.mp3";
export const pictureAudio = "4c34b55a-d1c0-4818-8a05-7d4fbe39cfef.mp3";

export const NumberNewImg = "2dbd9b96-1daa-4a3a-9027-6ff32f81378a.png";
export const numAudio = "30ffa191-c39b-4b35-ad52-cfe1bf970d67.mp3";
export const berAudio = "827d17b0-9c20-459f-b6a3-0d4ab2bc7263.mp3";
export const numberAudio = "6ef92525-dc5e-40ae-8c44-1f84ae72f3d8.mp3";

export const DoctorNewImg = "e03c3dbf-a6a2-4b0c-a5ca-6583c2b22af0.png";
export const docAudio = "636e1eb0-8781-458e-924c-92229352a886.mp3";
export const torAudio = "18c8ed24-82fa-4513-a106-65f19e126b19.mp3";
export const doctorAudio = "5337f05e-d4dc-430d-94ba-b05d15c1c670.mp3";

export const questionPaperImg = "2f34a23b-f983-40ea-8453-76c4e822d85d.png";
export const paAudio = "b4052806-689c-4682-a3c7-ec33949dc248.mp3";
export const perAudio = "b1e57519-8bb2-4e73-a63c-8fd2149376cd.mp3";
export const paperAudio = "b6abcdef-ed3d-4b65-aff8-a0ad1c156df2.mp3";

export const MonkeyNewImg = "54b34af6-ae55-4f37-9b19-fe58723f443f.png";
export const monAudio = "5992d808-23f1-46c2-a4e8-d143cd5ef452.mp3";
export const keyAudio = "163bc77c-5e44-41d7-aa29-548b21b50ab7.mp3";
export const monkeyAudio = "a3ec9f08-d445-417c-baf8-e239df5a271a.mp3";

export const gardenImg = "07c44745-e9e3-4264-9645-3da09b4d66c8.png";
export const garAudio = "ef6ad6aa-55bb-48ae-9997-c3dfe5563988.mp3";
export const denAudio = "7c24cc2d-ef4b-4598-b107-a2a2865cf196.mp3";
export const GardenAudio = "7c83b6e5-d40b-4144-b8e6-5524d31eedb3.mp3";

export const helmetImg = "5a0e821b-b8b4-45b0-980b-bf1b06e9b918.png";
export const helAudio = "95adff22-d860-4b79-851b-955a5b102065.mp3";
export const metAudio = "7d473604-5ac6-4160-8105-78d60a1b4f1b.mp3";
export const helmetAudio = "daafd516-a70a-43da-b150-db1754f0c9c9.mp3";

export const catImage = "1d6ac0b0-7c78-44fa-a577-1fa2eef31352.png";
export const Kit = "21960c5b-f3ca-410c-9c5f-475c24a64be2.mp3";
export const Ten = "ddae48b2-83a1-427e-bfd3-24a0b4953515.mp3";
export const KittenS = "7babb0dc-cca7-4e99-981f-4dc76b970a32.mp3";

export const Jacket = "b6053ca3-e946-4cba-bd2c-0dce36bbdc75.png";
export const Jack = "a2e3c1d1-c223-4e7c-8f86-c52eafe543c0.mp3";

export const JacketS = "99523c92-f5ef-47f6-9c3a-b284ae72ca0c.mp3";

export const pocketImage = "000cab4b-8140-4c59-99f1-520a136c8ed3.png";
export const Pock = "c6a097f4-03c4-40cc-913c-5406b6547fe6.mp3";

export const PocketS = "ef4ab51d-57cf-48bf-8790-b6deeb35a0b5.mp3";

export const boyChildImg = "3c2b2fce-5cb8-4f74-977b-00e25e05a629.png";
export const child = "31665b4f-973c-4fee-b86f-5e86ab4c6f33.png";

//M14P1
export const boyChild2Img = "6c6299e1-c120-4ddb-8032-2fc2c422b5fa.png";
export const level14P1OneUAudio = "4b92fe54-0fac-4605-899b-ef95de4f743c.mp3";
export const level14P1TwoUAudio = "b402b5d6-b3b9-4030-b9a8-1324f89d89c9.mp3";
export const level14P1ThreeUAudio = "814ba431-7f4f-4dae-b2c9-5c7beaa65838.mp3";
export const level14P1FourUAudio = "2b479267-f343-46c8-a7f6-7ade819e6b78.mp3";
export const level14P1FiveUAudio = "b3a95fe5-2e18-454f-8884-950a00d1b7f8.mp3";

export const humanImg = "5f0c40da-3004-45ee-af93-f54a90e30836.png";

//M14P2
export const collegeGirlImg = "4a0ce73d-c68c-4713-9eb7-75571b274f42.png";
export const level14P2OneUAudio = "b448a3d9-2eaf-498f-8f3a-0b16f18c22fa.mp3";
export const level14P2TwoUAudio = "acc859d6-3545-4e7a-a994-c35f82cfe4ff.mp3";
export const level14P2ThreeUAudio = "c2a62648-9b6f-4d18-bf01-6b54b6333db2.mp3";
export const level14P2FourUAudio = "4f83eacb-ba8b-4bcf-824c-63d3606d73e5.mp3";
export const level14P2FiveUAudio = "d6b91e82-fd9a-4faf-91e5-f7ca2cb725fd.mp3";
export const level14P2SixUAudio = "be39f831-3afe-4ed0-a6e2-b06bcf44c896.mp3";

export const salesPerson = "538bd172-fe70-4c2b-96a3-cda220afd1d7.png";

//M14P3
export const femaleAstronautImg = "29a6bb4e-7a2b-42c4-8652-ff24c488344a.png";
export const level14P3OneUAudio = "5d122827-0702-4d9a-b95f-73dd7e12be3f.mp3";
export const level14P3TwoUAudio = "74824db4-fec1-4223-87e2-a4b8c6067de3.mp3";
export const level14P3ThreeUAudio = "eb1ecef2-b433-4174-9818-76c5ca66d7cb.mp3";
export const level14P3FourUAudio = "3c932484-d77f-4c5a-97a2-70a1669d3929.mp3";
export const level14P3FiveUAudio = "0de7362f-551e-47eb-8b06-6bb32b6905c6.mp3";

export const vegVendor = "2867a995-7791-4c4b-a0a1-08af143503c9.png";

//M14P4
export const cricketBoyImg = "1737c544-0caa-4cc0-97b7-f6065f5e1dc6.png";
export const hockeyGirlImg = "a747d5bd-14ac-4e96-8d0f-214368951f21.png";
export const level14P4OneUAudio = "f9ddb5b2-5ae4-4b03-8691-e9d8f8507c3c.mp3";
export const level14P4TwoUAudio = "8238b827-7d5b-42e9-a0f1-e861d98f56ef.mp3";
export const level14P4ThreeUAudio = "b7602954-9099-479b-a171-060812df8e65.mp3";
export const level14P4FourUAudio = "0c8cc342-e02a-4821-8450-b844ebeb830f.mp3";
export const level14P4FiveUAudio = "681afebe-1ea2-4c9e-96af-8210d12c4fe4.mp3";

//M14S1
export const level14S1OneUAudio = "6085a733-52b8-44d1-82e3-a4433e44ff67.mp3";
export const level14S1TwoUAudio = "48929c5c-3dfc-4cce-9d52-204688535241.mp3";
export const level14S1ThreeUAudio = "849f006a-68f9-4204-8435-c2112514d9fa.mp3";
export const level14S1FourUAudio = "3a0cf6e6-47b3-4742-a787-244eff6bb46f.mp3";
export const level14S1FiveUAudio = "c2104ea8-dd8b-483b-918b-6a3ae584bfaa.mp3";

//M14P5
export const girlSprinterImg = "75c3f0a3-21ab-472c-b3f3-527231b3cc60.png";
export const level14P5OneUAudio = "d4b4b169-fc07-4008-9ae8-c7c2e8850a28.mp3";
export const level14P5TwoUAudio = "f773eb8c-c5f8-4866-8104-661aa3955bbe.mp3";
export const level14P5ThreeUAudio = "57f47fd0-94df-497e-a6af-8f5a7c348912.mp3";
export const level14P5FourUAudio = "04dc7d70-bc81-4f07-93bf-13ae0dcc2260.mp3";
export const level14P5FiveUAudio = "d26c8e8f-4824-49f0-b4c6-c955ac3b702f.mp3";

//M14P6
export const deliverymanImg = "e85a773f-8660-48b2-bcc9-6040d5d68a35.png";
export const level14P6OneUAudio = "59a254ca-cd6a-4af6-b9c6-640f0e113f75.mp3";
export const level14P6TwoUAudio = "9c574348-28c1-44b4-8ebd-c3877534d939.mp3";
// export const level14P6TwoUAudio_Alt =
//   "9cb94dc9-068d-4cbf-bc5d-a63f778a4c59.mp3";
export const level14P6ThreeUAudio = "85e92f8f-7cc5-4b71-aa2c-13e6a15b4556.mp3";
export const level14P6FourUAudio = "d2e88b0c-ba44-4dda-a5c8-0989a2bef948.mp3";
export const level14P6FiveUAudio = "7362c409-a07d-4464-8cb5-c2920c50629a.mp3";

export const mother = "ce29c00b-3912-4a12-83db-e0b5e4f081bb.png";

//M14P7
export const femaleTrekkerImg = "cf22896d-5553-49bb-a133-9c42bb30e945.png";
export const level14P7OneUAudio = "62f05f8d-f9fe-4e7a-8490-347f66093b6a.mp3";
export const level14P7TwoUAudio = "74fdd661-cf45-4b88-96a8-e96c776a06b0.mp3";
export const level14P7ThreeUAudio = "dab71c29-440b-4199-8a09-bc3fe8cbd008.mp3";
export const level14P7FourUAudio = "12a9d804-adc1-4fd5-b8a5-fc4ce4975118.mp3";
export const level14P7FiveUAudio = "f68f64cc-c660-4ee9-863a-533ea5cc5b2a.mp3";
// export const level14P7OneSAudio = "4b6130bc-1209-4526-b7ee-423789ffc4cb.mp3";
// export const level14P7TwoSAudio = "23b5c784-9a2d-4c3f-b44b-5dc354940f57.mp3";
// export const level14P7ThreeSAudio = "41227526-4f0c-4983-8570-ea5176f8f454.mp3";
// export const level14P7FourSAudio = "98e0d81f-707a-4ee0-94e6-b9427cb723d6.mp3";
// export const level14P7FiveSAudio = "34dd6510-9225-4c88-8c19-fcf7e705ca87.mp3";

//M14P8
export const ladyImg = "bd7cc11b-d639-4ee2-84b1-134eb0faa15e.png";
export const level14P8OneUAudio = "3d69d874-8153-4b27-a985-e3cc4586a614.mp3";
export const level14P8TwoUAudio = "2dfae373-b2b8-4c1a-8502-434bc6b3e021.mp3";
export const level14P8ThreeUAudio = "59616595-1fba-43ea-bf76-d1c0c534c110.mp3";
export const level14P8FourUAudio = "2859339f-961e-412c-8fdb-10de225f7ee7.mp3";
export const level14P8FiveUAudio = "6d4fe195-3b88-4dd9-9996-f846049270ad.mp3";

//M14S2
export const level14S2OneUAudio = "6b0cb945-540b-4b99-a502-d8a1551c7bab.mp3";
export const level14S2TwoUAudio = "c2b3d76d-4236-4b1c-8612-11783ffd047e.mp3";
export const level14S2ThreeUAudio = "eaeec126-e83f-4469-98ab-28b9b065cd53.mp3";
export const level14S2FourUAudio = "047752bc-c698-4918-ba5f-28441ca0e13c.mp3";
export const level14S2FiveUAudio = "cb117a2a-a50d-48e5-8a4e-8abdda654065.mp3";

//M12P2
export const level12P2CAudio = "49172a64-0c2e-4d1f-a080-2b087ae32e97.mp3";
export const level12P2Audio_1 = "80b01268-fbc8-476d-9414-78f3db57549c.mp3";
export const level12P2Audio_2 = "80b01268-fbc8-476d-9414-78f3db5753666.mp3";
export const level12P2Audio_3 = "70d683e8-13d7-4396-9a5a-bf9cb9ad3e87.mp3";
export const level12P2Audio_4 = "70d683e8-13d7-4396-9a5a-bf9cb9a53666.mp3";
export const level12P2Audio_5 = "2ede71ff-31af-408f-aa4b-2cacdf880c49.mp3";
export const level12P2Audio_6 = "2ede71ff-31af-408f-aa4b-2cacdf853666.mp3";
export const level12P2Audio_7 = "dd6a7da4-d2a0-4cbc-91b6-4d5f781efc2e.mp3";
export const level12P2Audio_8 = "dd6a7da4-d2a0-4cbc-91b6-4d5f78153666.mp3";
export const level12P2Audio_9 = "d832573d-039e-4276-8e59-19573da4bffc.mp3";

//M12S1
export const KasturbaRoadAudio = "cfd70c7f-25c1-485c-94c7-9d118c32e110.mp3";

//M12P6
export const level12P6CAudio = "2411de31-c7c0-42b3-9c75-decc0b77942a.mp3";
export const level12P6Audio_1 = "0b1b818e-1bb0-431c-b2f8-30757a4a4990.mp3";
export const level12P6Audio_2 = "0b1b818e-1bb0-431c-b2f8-30757a453666.mp3";
export const level12P6Audio_3 = "f7fb3297-a728-4ee4-8dd9-5dff53011b9c.mp3";
export const level12P6Audio_4 = "f7fb3297-a728-4ee4-8dd9-5dff53053666.mp3";
export const level12P6Audio_5 = "6ca92367-517a-47da-ac94-e8a3d6d5c032.mp3";
export const level12P6Audio_6 = "6ca92367-517a-47da-ac94-e8a3d6d53666.mp3";
export const level12P6Audio_7 = "d01242b1-9972-4c71-a941-8d631e08b180.mp3";
export const level12P6Audio_8 = "d01242b1-9972-4c71-a941-8d631e053666.mp3";
export const level12P6Audio_9 = "b9367264-8b13-4b08-8009-b26c26ee699b.mp3";
export const level12P6Audio_10 = "b9367264-8b13-4b08-8009-b26c26e53666.mp3";
export const level12P6Audio_11 = "5749c8d3-b3fc-49f5-b4d1-221ec4cffd0b.mp3";
export const level12P6Audio_12 = "5749c8d3-b3fc-49f5-b4d1-221ec4c53666.mp3";

//M12P7
export const level12P7OneAudio = "3b98838c-38f6-4354-9e88-c546c937ba81.mp3";
export const level12P7TwoAudio = "ff789f18-6696-44ee-8c14-9134f311b413.mp3";
export const level12P7ThreeAudio = "f9c80c02-9419-4890-97ba-e6ddcc455545.mp3";
export const level12P7FourAudio = "f670d9ae-0862-48a2-8987-6c1fcaebaa73.mp3";
export const level12P7FiveAudio = "fbc1b7d7-ae6a-49d4-b739-1b7f1ce1893f.mp3";

//M12P5
export const KasturbaRoad2Audio = "6cc1f0ba-d045-41dd-a300-5d9e3b7213f2.mp3";

//M12S2
export const TaraPlanetariumAudio = "ea114221-b6ff-483f-8b1d-d557489a5671.mp3";
export const PlanetariumImg = "ae59f62b-8699-4567-9f0c-4c70e2233153.png";
export const ChildrensParkImg = "263a1f6e-423a-472e-8e22-795f4dddcc82.png";

//M12P8
export const level12P8OneAudio = "4765b6c4-acce-45de-aec7-cb2ab8fa85ee.mp3";
export const level12P8TwoAudio = "a8295893-3f72-4fb5-b158-6e61a25255c7.mp3";
export const level12P8ThreeAudio = "c9a2a147-4159-4abe-bc7b-a022e4f282b1.mp3";
export const level12P8FourAudio = "0d7a344c-1517-47c4-bdba-18f1423b314f.mp3";
export const level12P8FiveAudio = "65f772bc-21d2-4900-a0c8-8693b9b2952f.mp3";

export const museumDirectionsAudio = "db8b8cb5-1cea-47d4-979c-fa9337e8f3d4.mp3";

//M12P4
export const level12P4OneAudio = "5db5b3c1-edb0-4a6e-9d08-60a2f5d9abb1.mp3";
export const level12P4TwoAudio = "54c37bcd-410d-410b-8dd4-42100d4330af.mp3";
export const level12P4ThreeAudio = "7bc37c68-0890-405d-b2e1-9c917fb44c9e.mp3";
export const level12P4FourAudio = "6146038e-12e1-4cef-b2bb-6e2c2d4f0b9b.mp3";
export const level12P4FiveAudio = "57df3360-ec72-48ff-8e31-b934f7dc809d.mp3";

//M12P3
export const level12P3OneAudio = "12cd2388-bf5f-4797-9c6e-2e51a314496c.mp3";
export const level12P3TwoAudio = "27996cf1-a950-420a-8c67-d9d431e07a50.mp3";
export const level12P3ThreeAudio = "b78d91b2-6aab-4318-a989-3d9024f3b8d4.mp3";
export const level12P3FourAudio = "b7a99530-f426-46f0-8b2d-75bc33dc83e5.mp3";
export const level12P3FiveAudio = "0f18475a-9f25-40ed-962a-d04f976e6010.mp3";

//M12P1
export const level12P1Audio = "0cd5fe8a-cdb5-42b5-9b35-bc3d2f0fd95c.mp3";
export const banyanTreeImg = "d3e5fe1a-c861-4114-9074-c7c3eed8c9f9.png";
export const mall2Img = "faede074-1b0d-4e09-9b24-fbd507578d4e.png";

export const catintroductionAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

//M11S2
export const cat2Image = "794f7713-738e-4ec9-9b34-33f0839030ea.png";
export const level11S2Audio = "6f6c0b8f-6916-45bf-bd0d-fc2f8a45b28d.mp3";

export const bf1 = "f91076fd-b3db-4544-8e38-f22664af2a21.png";
export const bf2 = "301f2216-5fa2-4865-bd97-bd9a348c914b.png";

//M11P7
export const manImg = "d92a1ef9-22de-4882-85ac-2ef15069fcd8.png";
export const level11P7OneUAudio = "1f1c2bc7-8018-4e85-8e5d-1c9b640e0145.mp3";
export const level11P7TwoUAudio = "2578fe65-d156-4f8b-9d75-323041210939.mp3";
export const level11P7ThreeUAudio = "16187fbd-3e9e-4d93-b5c4-967819b28d39.mp3";
export const level11P7FourUAudio = "d3e2677c-94c0-44dc-adcf-0ffe2d098c4d.mp3";
export const level11P7FiveUAudio = "1ee35b9a-1ddc-46c7-a27f-50e5ef424957.mp3";
export const level11P7OneSAudio = "4241e357-4200-410b-9601-4f117c0098db.mp3";
export const level11P7TwoSAudio = "4886449e-4d8b-4e3c-ab05-8421769e9bf2.mp3";
export const level11P7ThreeSAudio = "c2ba5235-029c-471d-951a-e182d625197d.mp3";
export const level11P7FourSAudio = "c5320688-fd89-4115-93ab-29c2e996b9d1.mp3";
export const level11P7FiveSAudio = "d7d61d92-cd92-4556-b73a-b881177cd8d0.mp3";

//M11P8
export const level11P8OneUAudio = "0ae8a8db-5713-4fc1-a6ab-ae50b9caabf7.mp3";
export const level11P8TwoUAudio = "1318a887-58de-4ca7-9280-288fb1865dbe.mp3";
export const level11P8ThreeUAudio = "45eda6f6-870a-4267-8a0c-4b2e0347ea2c.mp3";
export const level11P8FourUAudio = "af8e1fe6-872d-4413-9b48-1455fd961a6c.mp3";
export const level11P8FiveUAudio = "9209715e-6773-4f7f-b114-e6e572b9a9b2.mp3";
export const level11P8OneSAudio = "0d2c7694-318e-47f3-8d86-3935674bfb48.mp3";
export const level11P8TwoSAudio = "95dd413d-6db2-4d44-80a4-5578184a0646.mp3";
export const level11P8ThreeSAudio = "3153e1bf-2025-490c-8db2-2675a62781ee.mp3";
export const level11P8FourSAudio = "695b330f-a63e-4d79-be86-20469005f701.mp3";
export const level11P8FiveSAudio = "c5d49cef-0ab2-46b9-81ee-03da4e3035ee.mp3";

//M11P6
export const level11P6Audio = "78451122-778a-477b-b4ca-e46c2e6e6ba0.mp3";

//M11P5
export const level11P5Audio = "1054371e-0c7c-4428-baec-6069d45d2dd6.mp3";

//M11S1
export const level11S1Audio = "c3c5aa85-8bcc-450d-b144-74840e0a9d35.mp3";
export const familyFoodImg = "787509c3-7041-4d11-9a4a-1ab34daad2b6.png";
export const FamilyTVImg = "69888c40-7a56-4e57-8a8c-f52e9df36dcf.png";

//M11P4
export const kidImg = "70ee843b-f8ef-4111-b7ce-d9740bdba1d4.png";
export const motherImg = "21841d42-903b-45bb-8a1f-73c4edc7fef2.png";
export const level11P4OneUAudio = "d4dd4083-7999-412b-a082-424bdf1b67bb.mp3";
export const level11P4TwoUAudio = "5a9a3ed5-ee20-4cbf-9258-41118244130d.mp3";
export const level11P4ThreeUAudio = "90831f50-d2c5-4f24-8c8f-00d22c4858b4.mp3";
export const level11P4FourUAudio = "16edee35-2c3e-4271-bcd8-8ac374edc023.mp3";
export const level11P4FiveUAudio = "76b40c3c-e6b0-4f0b-b371-4b00d16e8439.mp3";
export const level11P4OneSAudio = "bd77b9a3-c04b-463e-9aa1-efdea0119070.mp3";
export const level11P4TwoSAudio = "c2a6397a-733c-4dbb-8e66-819b07471b8b.mp3";
export const level11P4ThreeSAudio = "854006c4-ecf2-41f0-859c-8e3a8657abd3.mp3";
export const level11P4FourSAudio = "a01a0964-084e-45aa-b0eb-73f43c9f15dc.mp3";
export const level11P4FiveSAudio = "f8bc49a1-ab49-4e8f-aead-504cc3ec365e.mp3";

//M11P3
export const thingirlImg = "10758df5-f2c6-47a8-84e6-3fccc286a634.png";
export const level11P3OneUAudio = "1865466a-b9ab-459a-908d-572a0c6ee092.mp3";
export const level11P3TwoUAudio = "16a56179-b078-4dc0-868b-3b76fdcb5679.mp3";
export const level11P3ThreeUAudio = "be333493-aa89-437d-b383-2424bcb2788a.mp3";
export const level11P3FourUAudio = "da684b6c-9a8f-4657-9469-71bceebafce3.mp3";
export const level11P3FiveUAudio = "1c421cc7-b418-44cb-ae47-0e4893a2a86b.mp3";
export const level11P3OneSAudio = "cd27e489-e9a3-4e23-995e-293d678fb8ce.mp3";
export const level11P3TwoSAudio = "3b78e417-4fcf-4462-803b-40ee0a3b4e7f.mp3";
export const level11P3ThreeSAudio = "d0c13fcd-b19a-4772-bb14-3f14bf8a054f.mp3";
export const level11P3FourSAudio = "fdf5092c-662f-44e4-a94d-3ab665349c7d.mp3";
export const level11P3FiveSAudio = "a9b36369-b8b2-423b-bc57-03ba15f92eae.mp3";

export const rahulOne = "4eb990fc-c4b8-4920-9c05-cb14c7cf795e.png";
export const rahulTwo = "ed2894a3-3730-4015-a4fa-85133fc6bd9d.png";
export const friendintroductionAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

//M11P2
export const level11P2Audio = "64c131a2-49f4-42b6-b826-691aac36e945.mp3";
export const boyfootballImg = "081a30ba-8a35-4836-9a23-cf003e1baf7f.png";
export const govschoolImg = "e75d2b0e-9f55-45c6-a78b-1787ee42a5a8.png";

export const dosaIce1 = "cab22300-541a-41a4-b7f9-bac30e6e455c.png";
export const dosaIce2 = "0d9f19e5-76cc-48df-b9a6-327b57053235.png";
export const SouthIndianAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

//M11P1
export const level11P1Audio = "1cc91c8a-4ed5-47bf-be30-a0a79b1b955e.mp3";
export const girlcycleImg = "fdd08f9c-1976-49e2-abc3-6f3a786e05ab.png";
export const girlTVImg = "b2c05e4f-9691-42f2-9fb6-106bd7b7c38d.png";

//M10P1
export const trainImgOne = "e68daca6-3dab-4323-b25c-fac63a5d4158.png";
export const trainImgTwo = "d3a6dd32-3b4f-4f13-a215-e72561f6eb4f.png";
export const railAnnouncementImg = "93bc06c4-06d4-44a3-be8f-e62a61444013.png";
export const bengaluruTrainAudio = "81b67384-f0cf-4237-8b3a-d57f3c3c56bd.mp3";

export const imageOne = "2afe10e0-4d94-490d-8242-19897849054f.png";
export const imageTwo = "71bd9c0e-e792-48b7-8b4c-1280939f88dc.png";

export const chennaiTrainAudio = "3d9f5fc7-1f93-4d9a-94c5-e2ede630447b.mp3";

//M10P2
export const childrenDayImg = "663df2b5-ba16-457d-9caf-eacaaf768100.png";

//M10P3
export const level10P3OneAudio1 = "33e14330-f0e6-4566-b095-ccb7e67e80ba.mp3";
export const level10P3OneAudio2 = "48a7ca99-a2d3-4f8a-8d22-45c77acebe2c.mp3";
export const level10P3OneAudio3 = "379699f6-70bd-4b47-8bac-166de5dc1e14.mp3";
export const level10P3TwoAudio1 = "4887f130-5f77-48e9-8fa6-329d5c2c87d6.mp3";
export const level10P3TwoAudio2 = "8f5a1a9a-2d3e-435d-af86-0459902a31bf.mp3";
export const level10P3TwoAudio3 = "f28c9aaf-4666-498c-b7ef-7d310002baa3.mp3";
export const level10P3ThreeAudio1 = "37a15644-33d1-4329-b914-ea3a7bbca10f.mp3";
export const level10P3ThreeAudio2 = "dd0d736c-7e39-48ba-a01b-bbd62754eff5.mp3";
export const level10P3ThreeAudio3 = "b54767f3-4455-4a52-94c7-d1c149bf4d1b.mp3";
export const level10P3FourAudio1 = "f686f4e8-da12-4eb9-a7d4-44c05c9e2498.mp3";
export const level10P3FourAudio2 = "71794dd8-c6a4-4c4b-916d-08dead39262d.mp3";
export const level10P3FourAudio3 = "b3fbe2f7-7ac2-41b5-b224-4b26d462d0d5.mp3";
export const level10P3FiveAudio1 = "1ed00c8c-8d17-40de-a649-5c6a1b54ee36.mp3";
export const level10P3FiveAudio2 = "8cb4d71b-27f8-41ba-922c-a6dcbb77cf45.mp3";
export const level10P3FiveAudio3 = "07149bfb-6128-41a1-8794-75ec33d5302d.mp3";

export const imageOneP4 = "f0471f58-d94a-48df-90a2-831b780e5914.png";
export const imageTwoP4 = "d3a6dd32-3b4f-4f13-a215-e72561f6eb4f.png";
export const imageThree = "481e761a-2254-4b7d-967a-36d0484aa2b6.png";

//M10P4
export const toyTrainAudio = "df76ae56-08dc-4ed0-b153-6cd648fe68cb.mp3";

//M10S1
export const villageAnnouncementAudio =
  "9ad6a141-654c-4ae2-b8c8-ace18d101d86.mp3";
export const villageDramaImg = "f959324f-8f80-40af-824e-30e6a8993514.png";
export const AnnouncementLadyImg = "689a4db7-1b40-4dc5-85a2-199e6da6a2aa.png";
export const childrenImg = "f4fcaa9e-5f08-43d5-8f47-967414faa05d.png";

export const biharAnouncementImg = "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";
export const patna1 = "298866f6-9ece-49cb-a49c-ce7a8ebac06b.png";
export const patna2 = "c79c4d26-816e-40f2-8c8d-4202385a8687.png";

//M10P5
export const TvBreakingNewsImg = "3baa6bb2-bba1-439d-8c46-8f5d683925cd.png";
export const HeavyRainImg = "7fe91e0a-d0a2-46b0-8e06-e6b18eeb54d5.png";
export const RainAudio = "2d1586f1-d0de-4f0b-bf34-9a360479f895.mp3";

export const reporter1 = "61a59cfe-aeb7-4c55-93d0-66001fe1f46b.png";
export const reporter2 = "94ec9353-5fe5-4d8d-b449-053dbe98d224.png";
export const cycloneAnouncementImg = "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

//M10P6
export const goodtouchImg = "432b5896-b145-45af-b141-1bae1ca5ded8.png";

//M10P7
export const level10P7OneAudio1 = "ac94a4cf-fc60-4c19-96d0-3cf0443e18ed.mp3";
export const level10P7OneAudio2 = "d97a021f-08f6-4806-b70f-1dceb784774b.mp3";
export const level10P7OneAudio3 = "3658c347-86e9-4ede-92ef-49af8f211e29.mp3";
export const level10P7TwoAudio1 = "929348bd-182a-4383-a75a-c3789db8507a.mp3";
export const level10P7TwoAudio2 = "eecbc1b4-39ff-4a84-8531-025d221e1e5a.mp3";
export const level10P7TwoAudio3 = "c934b977-15b3-4f35-9eff-d409c9e44684.mp3";
export const level10P7ThreeAudio1 = "d92bcd1d-6d30-4aa7-9042-5c242ceda338.mp3";
export const level10P7ThreeAudio2 = "032ab550-2036-436c-9809-cb8289e30cb5.mp3";
export const level10P7ThreeAudio3 = "f6d41fb0-d035-462b-831b-9bc82d807355.mp3";
export const level10P7FourAudio1 = "3cbd31f8-98af-402f-84ec-b760f82b50b2.mp3";
export const level10P7FourAudio2 = "7550d98b-ccd3-40fb-b99c-7850119527ec.mp3";
export const level10P7FourAudio3 = "af0d3a02-2332-4806-be13-3eb770564a23.mp3";
export const level10P7FiveAudio1 = "6db18957-a13f-4184-b350-196606d0eae9.mp3";
export const level10P7FiveAudio2 = "e27e24af-fe34-4aab-a594-06dab289495e.mp3";
export const level10P7FiveAudio3 = "16c1e433-46a9-475c-bbd8-a20565acb076.mp3";

//M10P8
export const hockeyImg = "533d2350-7cd2-49be-9241-4502fe8a988e.png";
export const TwogirlsImg = "be19f6b8-c79f-4312-ac91-df479ab0a1a1.png";
export const hockeyAnnouncementAudio =
  "fe4568bb-ea3b-4f4d-9bfd-4acd68ff7286.mp3";

//M10S2
export const level10S2Announcement = "b71f536a-08c8-4d51-b0ab-fa3d94409c6e.mp3";
export const telephoneImg = "44abe8ec-3789-47ce-84a4-5e57c47c9309.png";
export const womanphoneImg = "3335b5e3-81ef-4ad4-91b6-c58c7aec7a25.png";
export const childphoneImg = "752b2dc7-5a11-46d7-bcc8-04d90b7ee50a.png";

export const level10P7ThreeAudio1_2 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";
export const level10P7ThreeAudio3_2 =
  "45c73e28-34e0-45fc-aebf-cbb598a15a70.mp3";
export const level10P7FourAudio2_3 = "8e4918d2-638a-4e18-b40e-c43d169675ab.mp3";

export const level10P7FourAudio3_3 = "302d005f-b599-40da-a5c4-b19145398c84.mp3";
export const level10P7FiveAudio3_3 = "cf89bbdc-c974-4c1c-963a-e2fe38d1a67d.mp3";
export const level10P7ThreeAudio3_3 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";

export const level10P7ThreeAudio1_3 =
  "575ed5bc-cc99-401d-8a1a-306d48a97a3a.mp3";
export const level10P7ThreeAudio3_4 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";
export const level10P7FourAudio2_4 = "8e4918d2-638a-4e18-b40e-c43d169675ab.mp3";

export const gymAudio = "0228d1c0-1b62-4ad8-93f1-6934359516e2.mp3";
export const level10P7FourAudio2_5 = "c1a65608-eac8-414d-9401-569feeea0dc9.mp3";
export const level10P7FourAudio3_4 = "b71db360-4ef7-4937-a336-64b69138b50f.mp3";

export const gradenAnouncementImg = "cd29f151-4e2f-4b94-a9ff-f81ef8f69ea2.png";

export const gardenAnouncementAudio =
  "9ea4b3b4-ef3f-4f9e-a00b-4bef7dcb6c6a.mp3";

export const appleImg = "70d97e24-abf4-42af-8aa7-779801541372.png";
export const starRImg = "c7612b61-5569-4653-9ffe-d19ef47efa0a.png";
export const jugR1OneImg = "6ad6f42e-5612-44a7-80da-60bf2bd8ba4c.png";
export const starRAudio = "2330b2d9-4983-43ab-a49d-7cacfde535da.mp3";

export const sunsetImg = "a1861ef2-5584-4d5d-b79b-b7d1ae5082c8.png";
export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const spinRImg = "ed5cd7a2-66b1-4421-861d-fb53ed3a392e.png";
export const spinRAudio = "126a8b84-3e24-49ec-94d4-fe2a3699b46c.mp3";

export const skyRImg = "d0194f2e-e620-4c39-b26c-ce37e715c728.png";
export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const skyRAudio = "0ec9f86d-e0fc-4ebe-9d25-56b81820acff.mp3";

export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const treeRImg = "263197ac-0043-4107-b97b-0dd84318bc62.png";
export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
export const treeRAudio = "1f1492b3-2cb8-44ae-9fcc-3fb3e7103f83.mp3";

export const dragonRImg = "6224d1b7-4b9c-4b15-82f1-0a32853581bc.png";
export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
export const dragonRAudio = "de3d2baf-d919-4cea-9390-3ca778c9f62c.mp3";

export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const oilRImg = "83c24929-462b-4183-981c-dc3dd6446fa3.png";
export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
export const oilRAudio = "8bf4db27-d13b-4995-ada6-25e62cdacd2c.mp3";

export const streetRImg = "14ba16e2-c0ea-4a7e-a74f-141b35ae8cd2.png";
export const fanR1TwoImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
export const fanR1ThreeImg = "";
export const streetRAudio = "0a16bf2a-201d-4f6f-a659-7f8bb25a46cb.mp3";

export const pantherRImg = "0812d2e4-c981-4b60-8b61-61464ca73751.png";
export const hatR1TwoImg = "8932732b-15a7-4ced-adfe-c12da37cccb9.png";
export const hatR1ThreeImg = "e8a8b105-2e74-40c3-a522-2154fc8683d5.png";
export const pantherRAudio = "9ddf2dce-4492-465b-87d6-2997b8369d27.mp3";

export const shopImg = "6c8076bd-456b-4db9-af09-8fa97cf7181c.png";
export const listenRImg = "d1ee80cc-527c-45ea-b681-0a7e48dca89d.png";
export const pillowR1ThreeImg = "8f599207-cb9b-43fc-a5ab-f25e961ee3a7.png";
export const listenRAudio = "8ca34e18-c06f-4986-bddd-8bbfc7a8dd4a.mp3";

export const threeRImg = "53226804-e68a-4f52-97ea-460217c1e166.png";
export const ropeR1OneImg = "36ed39d3-3c97-4059-85d5-290c770df87c.png";
export const ropeR1ThreeImg = "bc63dc09-027a-4054-be26-92cc7b551f5b.png";
export const threeRAudio = "27e57622-4b64-42da-8a85-f337ffe10d10.mp3";

export const drawRImg = "76caa169-ebb1-48fa-a83a-bc71590fb7d8.png";

export const drawRAudio = "ba5bd6d6-d8b2-4b8a-b4ab-13bee94eac9b.mp3";

export const scratchRImg = "b768c75c-1fd0-4bf4-94b1-24265b2e8a89.png";
export const scratchRAudio = "aeee617f-33e3-4209-8687-be9482374697.mp3";

export const treasureRImg = "32a16c24-930e-4b22-8481-cc6cf0234b2b.png";

export const treasureRAudio = "449af00f-c148-44b8-84d3-71b45e45ef2a.mp3";

export const deskRImg = "8a6beea7-a0e5-439b-ade2-842b6b56af12.png";
export const deskRAudio = "f9f0b470-eac2-4ebd-99bf-84fb01b262e6.mp3";

export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
export const shoutRImg = "eb944944-ade7-464c-9566-a0fa4585c731.png";
export const shoutRAudio = "cc908f60-f082-4838-9343-d97db30cad06.mp3";

//export const shopImg = "6c8076bd-456b-4db9-af09-8fa97cf7181c.png";
export const whaleRImg = "cf68be78-d67e-4a5a-a065-85eea356c13f.png";
//export const pillowR1ThreeImg = "8f599207-cb9b-43fc-a5ab-f25e961ee3a7.png";
export const whaleRAudio = "e10e3687-fb63-4989-98d3-f972f29c5064.mp3";

export const aimRImg = "b1eb5874-5de3-4c02-ae37-433c96efa059.png";
//export const ropeR1OneImg = "36ed39d3-3c97-4059-85d5-290c770df87c.png";
//export const ropeR1ThreeImg = "bc63dc09-027a-4054-be26-92cc7b551f5b.png";
export const aimRAudio = "3686760d-c8d1-4c4b-9762-1fb570f073f5.mp3";

export const boatRImg = "4850effe-47a4-40d5-b13e-3524d014972d.png";
//export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
//export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const boatRAudio = "6f4b0e65-dbed-41ad-a676-78b4784d1f20.mp3";

//export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const phoneRImg = "c5ea8394-5db7-42b6-b70a-893c2da58337.png";
//export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
export const phoneRAudio = "441df672-e8ae-4cd5-bef5-5eaae9c65b3a.mp3";

export const orangeRImg = "0c8d1a4f-c2ec-4b4c-9c13-d3b2a11b9b85.png";
//export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
//export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
export const orangeRAudio = "897f476e-10b3-4c05-ae26-52a5572f5479.mp3";

//export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const clockRImg = "f1436985-91ff-4a5d-b73d-1f01829e7b0e.png";
//export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
export const clockRAudio = "0741e03e-5d64-44d5-af81-d911b2b4e9c0.mp3";

//export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
export const flowercotM1KanAudioRImg =
  "6f6bad72-035f-4f55-8e5d-e9ba7ee725b8.png";
//export const fanR1ThreeImg = "9e79a2d8-5133-4959-94a0-3b200ba1b92a.png";
export const flowerRAudio = "fe29fced-12d9-4e6a-b515-988c392636a3.mp3";

export const glassRImg = "b658a334-9405-489c-aa92-8a3879b9e452.png";
export const glassRAudio = "fadeb164-73fc-4953-a221-4d1d1405ae8d.mp3";

export const plantRImg = "78239c74-fc62-4e1f-b455-910d42313f65.png";
export const plantRAudio = "773719b0-b15e-4ef1-9414-41a15a5c6f65.mp3";

export const sleepRImg = "f2a51f1d-a6a5-4ce7-b759-e04b80b37989.png";
export const sleepRAudio = "4ca30e98-34b8-46dd-8f05-d260bbbff3da.mp3";

export const elephantRImg = "d4a75e05-6487-4b26-b9a7-d52f3123548e.png";
export const elephantRAudio = "2bc57efc-f252-48bc-b38e-cebef695a53b.mp3";

export const muscleRImg = "3341d761-6fd8-4aff-a2b1-8f09dde91f0f.png";
export const muscleRAudio = "054bd0c2-b095-4a34-ba41-3a409ae16394.mp3";

export const fieldRImg = "7577cf1f-b9d7-4d81-89b3-99aa42018a62.png";
export const fieldRAudio = "dd59cd48-04bf-480d-95af-32ad333ca707.mp3";

export const bicycleRImg = "dc8b7110-ac90-4f0a-a1b7-3e638f187479.png";
export const bicycleRAudio = "f2cbf13c-8c8f-44c5-ba99-a9929602c746.mp3";

export const mathsRImg = "efed2710-61bf-4d70-a71f-c673e483d20d.png";
export const mathsRAudio = "650db46c-d24f-45e5-9156-1e9bf1296089.mp3";

export const panRImg = "409081fb-b8ad-49ad-9567-fe460fc533c0.png";
export const panRAudio = "94b2d507-3adf-4e08-b334-579aa68ad795.mp3";
export const dogR1OneAudio = "2566aef0-9adb-40a0-af70-8a08844e227c.mp3";
export const capR1OneAudio = "452e865d-f4e1-4deb-8fb8-5ce6f21af966.mp3";
export const eggR1OneAudio = "4bf35d1b-36cb-4991-a2de-d0dc1e2b09ac.mp3";
export const batRAudio = "5b47db8f-527a-412d-b07e-336521eec5c3.mp3";
export const nestR1OneAudio = "892c5ec9-96f9-4686-9431-0445c83ee5fa.mp3";
export const puzzleRImg = "bc5f2ff9-23e0-4c78-9faf-187475f3e0f2.png";
export const ropeR1OneAudio = "f9fe157c-409c-4b41-860a-8e8489922cb1.mp3";
export const puzzleRAudio = "08a863f3-0014-459d-bd23-9eae2497924a.mp3";
export const lemonRImg = "8dc4f4fb-d8c4-42b1-b67d-7b77279ab1c3.png";
export const vanR1OneAudio = "0d2ce58c-2c4c-43b9-8548-bbdb36698c05.mp3";
export const lemonRAudio = "da93ccda-ec06-44af-8996-0cc6db1afb87.mp3";
export const bellR1OneAudio = "a98957c7-4356-488a-a8a8-df18793160ec.mp3";
export const kingRImg = "77201bae-ad45-4d72-85e7-801a1cd25459.png";
export const kingRAudio = "d9f6f612-5836-4df1-8c9b-7bed79167a70.mp3";
export const ladderRImg = "6bb722d3-3247-4aae-87f7-70c7cb896406.png";
export const maskR1OneAudio = "0dac8950-5b80-4615-a7ed-876b775b467e.mp3";
export const jugR1OneAudio = "8601e893-a55b-4709-acbe-3d3295876aac.mp3";
export const ladderRAudio = "dfc37247-5945-4ee5-a2e9-74f3ff371a85.mp3";
export const drumRImg = "ed6cff75-9f68-4650-b8d8-6cc0ec71f48a.png";
export const goatR1OneAudio = "2b66908b-8703-4384-b79b-9447f0eea3c7.mp3";
export const fanR1OneAudio = "36949692-19c2-49b1-9906-1a117c17c0d1.mp3";
export const drumRAudio = "79996f35-3fef-4f3f-822b-15716f358838.mp3";
export const coffeeRImg = "781044e0-6a89-4b08-acfc-222da83d394a.png";
export const coffeeRAudio = "3c27e9b5-cd13-418d-ac4b-7564744ed92f.mp3";
export const appleR1OneAudio = "d09312d4-4ab1-4845-8d6f-fbd61f83918e.mp3";
export const busRImg = "665edd0d-5d8a-40a7-86d2-ebfad3e80def.png";
export const cardRAudio = "28ed10c2-1b11-4e6a-8d19-3a167dc9c681.mp3";
export const graphRAudio = "b9dcd534-fa1a-4fdc-912a-0dd3aa69132b.mp3";
export const ovenRImg = "c27afb27-799c-441c-b402-6bece3b361d9.png";
export const ovenRAudio = "e3a15d5f-e663-4888-8dce-9b797b4d9c37.mp3";
export const tableRImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
export const tableRAudio = "1310fd30-ea87-4cd2-8a88-d4b9dbe690c7.mp3";
//export const basketRImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
//export const basketRAudio = "9c2208a4-6c4e-4c62-9439-00d5856fce24.mp3";
export const cardRImg = "df09a81f-a39c-4eb0-b254-4ad8e7765932.png";
export const frogRImg = "20ec0cf5-ea8a-434b-afab-a929fa08690c.png";
export const frogRAudio = "bb789538-f1f4-44cb-b19c-9c36714eefef.mp3";

//export const appleImg = "70d97e24-abf4-42af-8aa7-779801541372.png";
export const dogsBarkImg = "0012d4ce-4413-496e-814f-db47e408f1b5.png";
export const hatR1OneImg = "8a10681a-9205-4cf4-b4c8-1fa505f50f08.png";
export const appleNewAudio = "b2a39def-9a1e-4ec3-9793-03d79e3d3d52.mp3";

//export const sunsetImg = "a1861ef2-5584-4d5d-b79b-b7d1ae5082c8.png";
//export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const penImg = "d93c9643-b6b5-4883-a530-f59f23cd0b2c.png";
export const penNewAudio = "a4df3da9-0425-40f6-a43d-90ed9e40cda3.mp3";

export const bagR1OneImg = "af54b135-8f1e-4e9b-9f64-14d35a7f0027.png";
//export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
//export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const bagR1OneAudio = "4214e2f7-27c9-4803-80d4-bc27e205170b.mp3";

//export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const capR1OneImg = "45ee8428-8be6-4f6c-9f2f-e3a3e8d66ebc.png";
//export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
//export const capR1OneAudio = "f8f050c7-76c5-4e98-919e-b86257259584.mp3";

export const dogR1OneImg = "c5f5e3c0-e5cf-42f6-801a-a93eb1f1a185.png";
//export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
//export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
//export const dogR1OneAudio = "d911b611-3541-4586-b2f0-a6793af5d1fe.mp3";

//export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const eggR1OneImg = "7b05d394-76e8-4583-8abd-c520da39ca2a.png";
//export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
//export const eggR1OneAudio = "234b41b6-c366-409f-b08d-ed05ca3c26df.mp3";

//export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
//export const fanR1TwoImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
//export const fanR1ThreeImg = "9e79a2d8-5133-4959-94a0-3b200ba1b92a.png";
//export const fanR1OneAudio = "64347710-8fa6-420a-95a6-c1e4f47eead9.mp3";

//export const hatR1TwoImg = "8932732b-15a7-4ced-adfe-c12da37cccb9.png";
//export const hatR1ThreeImg = "e8a8b105-2e74-40c3-a522-2154fc8683d5.png";
export const hatR1OneAudio = "a9ca3145-3a81-4a83-ba73-9b60e71cdb5d.mp3";

//export const TigerNewImg = "c6513466-596d-4a47-abff-0c8202c0dc5d.png";

//export const glassRImg = "b658a334-9405-489c-aa92-8a3879b9e452.png";
export const batRImg = "92bc2f24-9977-45ea-99d4-a6af60dc7aab.png";
//export const batRAudio = "3fb1f250-4000-47b7-9a27-ef1c2ca3e483.mp3";

//export const puzzleRImg = "bc5f2ff9-23e0-4c78-9faf-187475f3e0f2.png";
//export const aimRImg = "b1eb5874-5de3-4c02-ae37-433c96efa059.png";
//export const puzzleRAudio = "a9da53f8-9ac1-4d20-9dd0-53c923dad44d.mp3";

//export const lemonRImg = "8dc4f4fb-d8c4-42b1-b67d-7b77279ab1c3.png";
//export const lemonRAudio = "2a428354-d584-4999-b8e1-fcf0aeca6140.mp3";

//export const drumRImg = "ed6cff75-9f68-4650-b8d8-6cc0ec71f48a.png";
//export const drumRAudio = "c4f68661-76a6-4e79-ae62-7df8c309ee2a.mp3";

export const basketRImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const basketRAudio = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

// export const level11P7OneSAudio = "aa04d176-298b-474d-9c6f-3396a4bf0d22.mp3";
// export const level11P7TwoSAudio = "b64641ab-1ae7-4768-8c30-82f1c3c36d2a.mp3";
// export const level11P7ThreeSAudio = "dac9f0ce-b747-4320-9b07-98cdd373b493.mp3";
// export const level11P7FourSAudio = "2a52ec17-e402-4c2b-a570-32dd118fd30f.mp3";
// export const level11P7FiveSAudio = "0b773f53-8674-4b46-a8fe-0b6b1b3c689c.mp3";

// export const level11P8OneSAudio = "929e4b79-1cca-4951-91a9-f67d4cd44a67.mp3";
// export const level11P8TwoSAudio = "0101df8c-7f1b-40f3-8f75-00dc8d6d14c7.mp3";
// export const level11P8ThreeSAudio = "e6b3e0c5-c609-466d-bd29-e8a2f296a309.mp3";
// export const level11P8FourSAudio = "630262c3-1bdd-4f2c-9303-7c686f036ef4.mp3";
// export const level11P8FiveSAudio = "ed2178ef-2a66-4556-b059-55d2c3ce55cf.mp3";

// export const level11P3OneSAudio = "4e13184b-6ac1-461d-9e74-37c52ebc8d93.mp3";
// export const level11P3TwoSAudio = "711b87fc-9772-437c-b885-22996d19189c.mp3";
// export const level11P3ThreeSAudio = "06c729cd-93fb-4860-b0c7-63c11f5f0593.mp3";
// export const level11P3FourSAudio = "2c2069f4-cc86-4595-9ca5-4804a1853997.mp3";
// export const level11P3FiveSAudio = "7348574b-4864-409b-b8ab-6fc883df1f0d.mp3";

// export const level11P4OneUAudio = "23f66a4a-66ba-4190-b14a-f9e7a8e05779.mp3";
// export const level11P4TwoUAudio = "2d608d86-a89f-4051-b868-f503dd239f1c.mp3";
// export const level11P4ThreeUAudio = "23ad4ddf-4726-44cd-8f2b-aa6e6a4db8e3.mp3";
// export const level11P4FourUAudio = "a4955a1f-b7ff-4c3c-9c55-7a9adcaeed24.mp3";
// export const level11P4FiveUAudio = "66035aef-f71e-44c1-8d12-0db87907a475.mp3";

// export const level11P4OneSAudio = "33d117b5-5b8d-4cb9-ac3b-b79c94c74bb8.mp3";
// export const level11P4TwoSAudio = "c56ee590-dfa3-4228-9519-13a7ce085af4.mp3";
// export const level11P4ThreeSAudio = "01d8b532-e31e-4558-9885-77f072262581.mp3";
// export const level11P4FourSAudio = "b9fd2059-448d-4e75-98d5-1277deecf050.mp3";
// export const level11P4FiveSAudio = "8e5bbc10-95b2-45af-bf73-5d31cbc5bd2e.mp3";

//export const DinnerNewImg = "d8ae7f85-9262-434b-a813-5dd07780f7f0.png";
//export const shoutRImg = "eb944944-ade7-464c-9566-a0fa4585c731.png";
export const DinnerAudio = "a01366a7-e0a6-4a00-9e44-afcabfe46190.mp3";

export const sunShinesImg = "c1c4cf77-b951-4c2f-a2aa-ecd8725e7702.png";
export const wePlayImg = "bf38ed9b-01e5-43fb-b981-daa83f1fd63c.png";
export const heDancesImg = "0db9a578-3b48-4d6e-908f-3fd95d09c894.png";
export const sunShinesAudio = "bacfa1df-a291-484a-8bfd-2ce3dd5e4d8d.mp3";
export const fishSwimImg = "024d99b9-19dc-4bb7-82db-ccc5f23933f8.png";
//export const dogsBarkImg = "0012d4ce-4413-496e-814f-db47e408f1b5.png";
export const itRainsImg = "7fe91e0a-d0a2-46b0-8e06-e6b18eeb54d5.png";
export const fishSwimAudio = "d73b01b7-98d3-44f4-832b-31552e621dbb.mp3";
export const birdsFlyImg = "e6221717-d50b-4ca0-a0ad-d0ca93c73bfc.png";
export const sheReadsImg = "53a1261c-45c8-479c-ad78-2e5c5010526b.png";
export const weWinImg = "40c70927-e024-46c6-a4fc-856628d5d52d.png";
export const birdsFlyAudio = "f251e1e7-90c6-4f63-ac94-c7734df1a242.mp3";
export const sheSmilesImg = "7bb340e4-9549-4261-9724-c4dab309b899.png";
export const babyCriesImg = "2639fe7e-1422-4fcb-9382-d0138711b9a1.png";
export const heEatsImg = "05d02b15-f45b-4175-bdbd-323af82c33be.png";
export const sheSmilesAudio = "2106ad72-664c-43cb-9e2e-84622f68d11b.mp3";
export const youCookImg = "7547c0bf-6e0d-4151-99d5-db08c2f0aade.png";
export const theyLaughImg = "954c05e5-4cd8-452b-ae75-40e87f5fd908.png";
export const theyLaughAudio = "7f16821e-687f-4366-9509-4837202ac1bd.mp3";
export const wePlayAudio = "82877552-3a10-44d7-9683-90f64d63ee12.mp3";
export const clocksTickImg = "4c9fe4a6-8e62-441b-b9d8-3724c684d365.png";
export const sheSingsImg = "f9465763-4ce0-498a-b311-6891b0f404a6.png";
export const heDancesAudio = "8da026a1-c4b0-4c70-9bac-b8c11ac5c809.mp3";
export const flowersBloomImg = "1e3a27bd-f79e-4783-bcb0-3561652c6402.png";
export const sheSingsAudio = "7f06ea20-7c39-4621-8894-2dc9cf6ff417.mp3";
export const dogsBarkAudio = "344a89b5-b688-4ebb-9920-a6f91275c5cb.mp3";
export const iSleepImg = "94cff671-ae28-4a44-9819-0f104c73ec3b.png";
export const itRainsAudio = "34fddc0f-630d-40ca-82ed-7a7ae70d0d85.mp3";
export const youSwimImg = "eb0c4db7-ee6d-49bd-add2-c5292bbbbb7d.png";
export const youSwimAudio = "5f75ae16-870f-4de2-959c-5ee85ccb84bf.mp3";
export const iSleepAudio = "78dcd577-e299-47f0-b60d-278869d44bf1.mp3";
export const heEatsAudio = "5e0d0c63-5915-494d-a0cf-c303dee5194c.mp3";
export const sheReadsAudio = "80033243-d086-4835-b634-9524bd69c5f9.mp3";
export const clocksTickAudio = "3fff4b64-5f48-406d-99fc-88e1aafb6c02.mp3";
export const fireBurnsImg = "2471f4ed-9509-4e7f-bad0-f2b3efdb1186.png";
export const flowersBloomAudio = "a194c1fa-f6cb-4c97-a28d-8569d3e80790.mp3";
export const fireBurnsAudio = "1a804c02-c3c5-4251-a68f-2845f86aeb02.mp3";
export const babyCriesAudio = "654634db-5e03-4d3f-8216-f88edcf014fd.mp3";
export const youCookAudio = "5e9bdb5a-3df7-4789-8608-89e3b3b144e5.mp3";
export const weWinAudio = "14495c91-e4fd-493c-b219-cd27ab992df9.mp3";

export const Father = "6c26a434-6cae-4b59-844c-5ed360177267.png";
export const fatherNewAudio = "b54e3b55-f217-44b8-88ea-74f04139a651.mp3";

export const mangoR1OneImg = "186c263c-b157-44a0-99e4-636f83dc5ebd.png";
export const mangoNewAudio = "b0759f9c-7b52-4c67-ada8-2952933b8b78.mp3";

export const Mother = "0ffcd7ce-47c9-4d8a-b14b-ba4cc7a23be3.png";
export const motherNewAudio = "a2672cff-2529-4049-9f87-cf8b45e381b5.mp3";

//export const pencilImg = "dfa309a9-713b-4726-b822-d0423c033175.png";
export const pencilNewAudio = "d665d6b3-e427-44f6-897f-9080c51d11f4.mp3";

export const waterImg = "062a7af5-7dc7-4b3a-8977-e26fbbc8fc31.png";
export const waterNewAudio = "bf1a9a89-0607-4c72-91f0-5e0cf699cec0.mp3";

//export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const basketNewAudio = "04b93f9b-8ff4-4b9a-89d3-85c623bf4695.mp3";

export const cricketImg = "5a51abc0-cd61-4a07-b5e7-f3fa1c87182b.png";
export const cricketNewAudio = "0a75e2ec-7f59-45df-9223-1dcfc059cd7f.mp3";

export const doctorImg = "e03c3dbf-a6a2-4b0c-a5ca-6583c2b22af0.png";
export const doctorNewAudio = "63391d95-d84b-4d70-a067-bc5eccb35dfe.mp3";

export const marketImg = "b0d3e32f-ff4f-470a-b744-567eff9d1f99.png";
export const marketNewAudio = "9c2c72cd-96fd-4899-806c-1cf40f159434.mp3";

export const windowImg = "2fc1a46c-7a7b-44de-8f2d-da5a69b6793d.png";
export const windowNewAudio = "4e50ad4f-9df7-4b65-8c5e-3b9b13c6345d.mp3";

export const balloonImg = "dc7c02df-4cb4-46c7-83e0-53cfc962ab24.png";
export const balloonNewAudio = "0ff989d4-cfc0-4592-97dc-d4af19bf1cec.mp3";

//export const bicycleRImg = "0548cabb-fda1-49fe-884d-a5c480c8240c.png";
export const cycleNewAudio = "d9e60dd3-12a2-49f7-9bf2-2cc231d053be.mp3";

export const candleImg = "deb25a51-ce94-4835-802e-5172f5906d42.png";
export const candleNewAudio = "9d512ab4-da20-41a8-b899-5676fdc63e95.mp3";

//export const gardenImg = "07c44745-e9e3-4264-9645-3da09b4d66c8.png";
export const gardenNewAudio = "fb6b6ee4-0f5b-44af-afe9-c93091b71798.mp3";

export const scooterImg = "2f68c007-3277-4ca0-ac65-905c40af4fbd.png";
export const scooterNewAudio = "d08203de-438c-4bfa-9411-6a840cd6c1ce.mp3";

//export const flowerRImg = "ecb2ac92-c9ab-453e-bf89-015e9407e342.png";
export const flowerNewAudio = "7f76eea0-e602-4751-9015-924121ba0fcf.mp3";

export const papeerImg = "b0dee69a-b90e-4098-bbca-1722a05f05c0.png";
export const paperNewAudio = "2163f839-c007-4c01-ac4c-9539c3fbb5f6.mp3";

export const puppyImg = "6b6eddcc-c407-44a9-b08c-247f81d352a6.png";
export const puppyNewAudio = "86be014e-bb23-403d-b6e3-9f73ebf8aac9.mp3";

export const studentsImg = "3b34219b-1ed7-435a-b6ab-b0c3cb0b7962.png";
export const studentNewAudio = "c9d20f52-6d62-426b-a784-c6493ede67cd.mp3";

export const musicImg = "ef9d0cf3-8041-42e7-bdf4-b2b45b5418f3.png";
export const musicNewAudio = "2610cc0a-4af9-45e4-bec5-e86b6b7df06b.mp3";

export const superMarketAudio = "680e320f-e18e-4083-abb4-4b93ec121206.mp3";

//M13P1
export const level13P1CAudio = "382ac38e-e2ab-4f3c-822e-0b173088c75e.mp3";
export const level13P1Audio1 = "32f1ed5b-9c42-4605-95ee-a194cfedc96a.mp3";
export const level13P1Audio2 = "9f482291-618a-475c-8afb-d312645b382f.mp3";
export const level13P1Audio3 = "9f482291-618a-475c-8afb-d31264553666.mp3";
export const level13P1Audio4 = "04cebdcb-542d-4fab-9f4c-48969170011e.mp3";
export const level13P1Audio5 = "04cebdcb-542d-4fab-9f4c-489691753666.mp3";
export const level13P1Audio6 = "53411352-fe0b-4d68-b8aa-079eb284ef47.mp3";
export const level13P1Audio7 = "53411352-fe0b-4d68-b8aa-079eb2853666.mp3";
export const level13P1Audio8 = "afcf2e70-01cb-4ef9-bd0b-f1eb65037006.mp3";
export const level13P1Audio9 = "afcf2e70-01cb-4ef9-bd0b-f1eb65053666.mp3";
export const level13P1Audio10 = "87c8c421-8c04-4452-ad83-01e39f5a3639.mp3";
export const level13P1Audio11 = "87c8c421-8c04-4452-ad83-01e39f553666.mp3";

//M13P2
export const meetingImg = "7de8bdf8-ecd6-43da-bc49-038a6cfad54b.png";
export const vacationImg = "8bfa6176-3b07-484d-afd9-16d9a46fd359.png";
export const partyImg = "721e39b7-8b56-42e8-a29b-0bb7efbb6839.png";
export const mall3Img = "59acadd9-5d42-4fdb-af7d-20dea54752e0.png";
export const hillstationImg = "8db64297-c18e-4a89-b1ee-2e4a1766aa25.png";
export const restaurant2Img = "40918719-b659-4427-b2e8-95e0f2928daf.png";
export const fiveImg = "349383bc-9849-4fd5-9da4-050e49ce6ff9.png";
export const tenImg = "0159baa4-d330-44a5-a1b8-a1a7bab4db8b.png";
export const threeImg = "d9697190-60be-4022-93db-23b9c64b344b.png";
export const alone2Img = "5750d0ef-cfc8-4119-bad7-6108a15a7462.png";
export const family2Img = "5f1a001d-092d-4804-a14b-5e69304e38b5.png";
export const freind2Img = "5e9d3207-6fd4-4b54-91d5-597ce4a284e1.png";
export const sunriseImg = "6ae36924-9c97-4ec9-a626-5ed42c3fd9cc.png";
export const peopleImg = "363f84bd-9a7a-480d-850e-3f053d44a955.png";
export const villageImg = "1d39ce31-e212-4096-aba9-52cd1de3ab69.png";

//M13P3
export const henOneImg = "469e1743-60b3-46e6-997e-a615f712c57b.png";
export const henFourImg = "448d8407-81ec-44a7-9d03-d19e99843c3a.png";
export const henThreeImg = "79a95b0a-d5d8-4354-9bcb-207e1c718bfb.png";
export const henFiveImg = "aae5ddeb-27dd-4c51-86a1-6bda034fc146.png";
export const henTwoImg = "cab63c6d-ec6f-4467-a717-1a4dcb8458cf.png";
export const henOneAudio = "c3f6050b-56a3-46c7-bbb0-65acf156f22d.mp3";
export const henTwoAudio = "37dd4bfb-55f2-4957-93d4-369a91de9a7d.mp3";
export const henThreeAudio = "56d42f29-08c4-4d5b-b3ee-49ee8ba7bf1c.mp3";
export const henFourAudio = "600c8eb9-cfed-4173-8fc6-899a27fffc8c.mp3";
export const henFiveAudio = "1dca512f-1865-4203-b9ef-a36bcdbd28fa.mp3";

//M13P4
export const healthyHabits2Img = "0013ae35-6a5c-40c1-98a6-936756b9cb04.png";

//M13S1
export const level13S1CAudio = "cb3391a1-d757-4049-903d-40360a62dba6.mp3";
export const level13S1Audio1 = "c5adfde1-18e7-4ffc-98d8-828d04f1dc84.mp3";
export const level13S1Audio2 = "0e83e1cc-ce4d-4f4d-8fe8-3c712a1a7902.mp3";
export const level13S1Audio3 = "0e83e1cc-ce4d-4f4d-8fe8-3c712a153666.mp3";
export const level13S1Audio4 = "61069c3f-76d2-4ff7-b9d5-e70608fb6875.mp3";
export const level13S1Audio5 = "61069c3f-76d2-4ff7-b9d5-e70608f53666.mp3";
export const level13S1Audio6 = "8851c001-2eed-4c16-8b29-25ab92ba1e34.mp3";
export const level13S1Audio7 = "8851c001-2eed-4c16-8b29-25ab92b53666.mp3";
export const level13S1Audio8 = "47695f35-c6fe-43cb-848f-ff99ba7700ca.mp3";

//M13P5
export const level13P5CAudio = "7327e8d9-7ed9-434a-9973-1a903190e6dc.mp3";
export const level13P5Audio1 = "8c5ce169-6b30-46ed-957c-ea7749de7172.mp3";
export const level13P5Audio2 = "33e7a236-ff33-49e7-a552-3d08377d0dde.mp3";
export const level13P5Audio3 = "33e7a236-ff33-49e7-a552-3d0837753666.mp3";
export const level13P5Audio4 = "8352f8e8-6767-4cb8-bead-991a16b60816.mp3";
export const level13P5Audio5 = "8352f8e8-6767-4cb8-bead-991a16b53666.mp3";
export const level13P5Audio6 = "235a0307-0a08-4c76-9603-41b25c7b8963.mp3";
export const level13P5Audio7 = "235a0307-0a08-4c76-9603-41b25c753666.mp3";
export const level13P5Audio8 = "1bc4f4ee-f78d-49e5-a231-6a1047760d14.mp3";
export const level13P5Audio9 = "1bc4f4ee-f78d-49e5-a231-6a1047753666.mp3";
export const level13P5Audio10 = "bdb93886-3ffe-4540-8e87-ae2cb1148212.mp3";
export const level13P5Audio11 = "bdb93886-3ffe-4540-8e87-ae2cb1153666.mp3";

//M13P6
export const racketImg = "9b66012e-d3b7-4dd2-a332-5469b218aab7.png";
export const netImg = "4f99897c-d14e-490a-abee-2e9784af45bc.png";
export const batImg = "4d662d87-4103-42c9-ac9d-23884b7f1992.png";
export const stadiumImg = "2c605b29-980c-47c4-811e-9a3a2fd1393d.png";
export const coachImg = "f1564103-1ad7-4c80-936b-6361ec73c8b2.png";
export const doctor2Img = "50ebd11f-b482-41a4-b397-a3f95d85837c.png";
export const teacher2Img = "3eb07c4e-2092-4601-a707-3b3e5af4573a.png";
export const water2Img = "97dff11f-b5ad-47bb-8cfe-8c055b99787b.png";
export const juice2Img = "73396dc5-0c80-410b-83b2-890fcd754187.png";
export const milk2Img = "55eae923-6a87-48ac-96fd-08514478f9e4.png";
export const breakfastImg = "08dfa62e-af52-48bf-a4ee-97d164076206.png";
export const burger2Img = "0a4250e6-ed08-4981-b96e-3e0ba74c1042.png";

//M13P7
export const butterfly1Img = "fb2c9a14-2f08-4d1f-aacf-a9b150fbd6e9.png";
export const butterfly2Img = "8603df19-6c24-4b93-8da6-cfb4077e0eae.png";
export const butterfly3Img = "41a1818a-4ca2-42c8-8350-257f3ba0691a.png";
export const butterfly4Img = "34f8ab46-845d-49f6-ad9f-f0e0b5b7f9a7.png";
export const butterfly5Img = "323e32c5-3945-468a-bd18-65503ba3317b.png";
export const butterflyOneAudio = "6a7a4f91-158e-4ac7-ba58-10c1f1f46ebd.mp3";
export const butterflyTwoAudio = "6e6c808b-3226-444d-a37f-372783e14528.mp3";
export const butterflyThreeAudio = "6168e928-f449-457b-904b-b71795841c11.mp3";
export const butterflyFourAudio = "1aeb2a94-3040-45f5-890c-972fd2cc47d6.mp3";
export const butterflyFiveAudio = "17d8bf00-dc58-429b-b94d-e5c7c9e2fe94.mp3";

//M13P8
export const roadSafety2Img1 = "9a7b7769-063f-4643-9e9b-d769a61d7951.png";
export const roadSafety2Img2 = "520b289d-062e-4b57-afff-64ce0816783f.png";
export const roadSafety2Audio = "a465b2b8-fe08-4aa2-ae7d-10f3af4b97dc.mp3";

export const bengaluruImg = "0ec69ace-ce8a-42c3-865b-76f9d80824da.png";
export const hospitalImg = "d8cd7610-7c19-4fcb-9ea2-0f549b860e73.png";
export const restaurantImg = "7b7d1cde-51e6-4088-b8f1-c3059764f838.png";
export const aloneImg = "d28c1ea6-bef7-4dd8-8310-87069292429e.png";
export const groupImg = "ab29cde8-197b-4466-b1af-746d695cc95c.png";
export const familyImg = "817ed644-e9b2-436a-9b7e-932e215739bd.png";
export const petImg = "0ff82049-384d-4c24-9bf7-bb8a63af37c4.png";
export const friendImg = "8a5354d0-0944-4788-9de2-1851af77ae0b.png";
export const teacherImg = "206b38d7-4127-4818-a47e-153ed3b35f55.png";
export const fairOneImg = "243c1811-01c1-43b3-a21a-6acb469fedb7.png";
export const fairFourImg = "2eaecfe5-a781-492a-9ab8-af01840b9e75.png";
export const fairThreeImg = "f00462ba-6e78-4019-bb95-adf4a6212e8b.png";
export const fairFiveImg = "c517e938-6536-488f-8902-1256a6eccb41.png";
export const fairTwoImg = "2854e3a8-db40-4d99-910b-c4f057a912e0.png";
export const fairOneAudio = "db51b8c2-3a08-45ff-9362-175d0a5c40b1.mp3";
export const fairTwoAudio = "cea8a2d9-b796-46af-9e26-7860d6473cb0.mp3";
export const fairThreeAudio = "349edbe4-ebb7-4f10-978c-888993509dd6.mp3";
export const fairFourAudio = "8327296a-679a-403c-bb9e-392ccbd27aed.mp3";
export const healthyHabitsImg = "9ec160c8-766c-4646-958f-94a667ac1964.png";
export const shoesImg = "29212161-1c14-41ae-bd6e-87b5969c1252.png";
export const hatImg = "b1c1787f-be4c-48a7-b01c-2d3d5970f9cf.png";
export const glovesImg = "237ec9af-9c1c-4a0c-aac9-1c4d14c9654b.png";
export const parkImg = "44555c03-7861-4174-bc17-6ee6baf54ddd.png";
export const mallImg = "2f30b3ab-220c-427b-95c7-edf3452bbbc9.png";
export const officeImg = "97eb6889-c5bd-4034-9a4f-6539c9b8a2f9.png";
export const thirtyImg = "69a4e043-d0e1-44e6-b2af-6be26f8803f7.png";
//export const fiveImg = "ae5a3725-48cc-4fba-ae26-b5cc1902ad2a.png";
export const sixtyImg = "6eac8731-adee-48c2-a7b1-0c2a956f8e9a.png";
//export const waterImg = "589f1bd2-4272-4f5f-87db-0923aac6765f.png";
export const juiceImg = "899f394c-3d8a-48fe-b941-224e39f58aea.png";
export const milkImg = "dd005ee7-15da-4563-9544-507587f5264d.png";
export const smoothieImg = "f61243ae-3ddc-483a-adfc-cfbe0c01c8ab.png";
export const burgerImg = "6962e00e-ce2e-42b1-ba9c-4dfef45c9f86.png";
export const pizzaImg = "2370e2ca-4aab-4880-9c55-281cd4d41f22.png";
export const puppyOneImg = "9323413b-c982-445f-832a-6d180ef5d803.png";
export const puppyFourImg = "fab193ef-57a4-4443-a8d9-656195a7c1a7.png";

export const puppyThreeImg = "cf78aa57-8d61-4546-a656-820c5787e767.png";
export const puppyFiveImg = "5e655ccb-b938-4428-9a58-def0c2f87407.png";
export const puppyTwoImg = "347b585c-d047-4194-817d-0b9e445e0367.png";

export const puppyOneAudio = "26076cca-2de7-4316-ac6f-30528efe0257.mp3";
export const puppyTwoAudio = "4155aeef-2f8d-41ee-b676-2e016d26c517.mp3";
export const puppyThreeAudio = "351c8150-edb1-4e41-8928-71e88066b5de.mp3";
export const puppyFourAudio = "7792d1c8-f1db-456d-950d-df7334c86875.mp3";

export const roadSafetyImg1 = "9a7b7769-063f-4643-9e9b-d769a61d7951.png";
export const roadSafetyImg2 = "520b289d-062e-4b57-afff-64ce0816783f.png";
export const roadsafetyAnouncementImg =
  "c8ea41ca-4462-4d91-abc9-de32a6a7a17e.png";

export const roadSafetyAudio = "b2c4dd09-26f2-4613-b066-ee7e25d01bca.mp3";

//M13S2
export const level13S2CAudio = "420e5f17-7732-4ddd-928b-e8b2f025aa92.mp3";
export const level13S2Audio1 = "215b4ee8-0b6f-449f-a255-bb64f0fa0009.mp3";
export const level13S2Audio2 = "aacc273e-f37c-44c8-b2c6-4dc0717c4fde.mp3";
export const level13S2Audio3 = "a7c03a9a-13d3-4228-8527-00a3dfea8869.mp3";
export const level13S2Audio4 = "0029b9ea-28eb-48e6-82be-877219e18b22.mp3";
export const level13S2Audio5 = "d711339c-6046-4ead-8942-3db286c374ce.mp3";
export const level13S2Audio6 = "d47feb58-cb82-425d-87ac-65ed4bf92511.mp3";
export const level13S2Audio7 = "3125011b-f314-4cf6-9548-ff94579a0767.mp3";
export const level13S2Audio8 = "40f358a4-fc26-408a-8691-003d6818d489.mp3";
export const level13S2Audio9 = "7f96f637-b06e-4934-b294-86b25d361862.mp3";
export const level13S2Audio10 = "bd467f77-e0d5-44fb-84de-2dc8d03f9634.mp3";
export const level13S2Audio11 = "910bc51a-ea9b-4c85-8b5a-eb4ca6755e65.mp3";

//M15P1
export const UniversityGirlImg = "b7744e23-ae77-423a-935d-2911165fa1a1.png";
export const level15P1OneUAudio = "c5b06acd-2308-4e9e-a6f2-b8b45854f2cd.mp3";
export const level15P1TwoUAudio = "85714f2e-0228-4261-97d0-dd7c51c8b0f7.mp3";
export const level15P1ThreeUAudio = "fd6398c3-4669-4138-8c27-71fb3fdf31b3.mp3";
export const level15P1FourUAudio = "bf19734c-3c3b-4e01-9c2f-35c48c80917b.mp3";
export const level15P1FiveUAudio = "1a662eda-9a32-4daf-bf6a-04c94c24af1b.mp3";
export const level15P1SixUAudio = "1ef31155-93a1-4e0e-b000-4f301dd23ac6.mp3";
export const level15P1OneSAudio = "518cb61d-05ae-4d47-b6b1-2a16b07393d1.mp3";
export const level15P1TwoSAudio = "0b10c8ce-879c-436c-b00f-c0fdc13c5ecf.mp3";
export const level15P1ThreeSAudio = "88afff2e-1b17-45e4-b281-5ba016ee32b9.mp3";
export const level15P1FourSAudio = "3d12e80e-372e-4229-a2b6-82296c4fb564.mp3";
export const level15P1FiveSAudio = "5ce6fa45-67fe-4354-947b-f9214196b24b.mp3";
// export const level14P1OneSAudio = "0098f035-432c-4531-a1f1-8fbbbb3fe8fd.mp3";
// export const level14P1TwoSAudio = "e7ae85bc-9147-4539-a4f4-ca471717005b.mp3";
// export const level14P1ThreeSAudio = "8d84f24c-604c-4b21-83a1-aec538d46068.mp3";
// export const level14P1FourSAudio = "c056f714-1982-45f8-962f-6615714e2007.mp3";
// export const level14P1FiveSAudio = "4a0de0e8-acde-48cc-b3ef-3acc6368b41c.mp3";

// export const level14P2OneSAudio = "621d2ddc-5258-452d-b0ad-8d8f5c94cf06.mp3";
// export const level14P2TwoSAudio = "3fd55559-542c-44f8-9881-cf0baeb4aa8e.mp3";
// export const level14P2ThreeSAudio = "43bda94d-b9ee-4162-bb4b-fe8c9cd868ce.mp3";
// export const level14P2FourSAudio = "e139821c-9a0c-456a-bebe-8cbd5ebdebf0.mp3";
// export const level14P2FiveSAudio = "90d9480e-3797-4bda-bda9-797aa643e5b6.mp3";

// export const level14P3OneSAudio = "2fb05e81-6d2d-445d-bcd9-c1e97b4bb81a.mp3";
// export const level14P3TwoSAudio = "0a6599b9-633c-4f23-9f8e-a35b536bd2f2.mp3";
// export const level14P3ThreeSAudio = "0a6599b9-633c-4f23-9f8e-a35b536bd2f2.mp3";
// export const level14P3FourSAudio = "d2e2dd41-4f7b-4118-b926-a6a8f44b6ff7.mp3";
// export const level14P3FiveSAudio = "fe552ea6-8196-4d1c-b3c3-5df901b55070.mp3";

// export const level14P4OneSAudio = "f1ef117b-f26b-430e-a74e-14d1e37c98b4.mp3";
// export const level14P4TwoSAudio = "b9e62576-e2b5-4135-bff9-ac4fae7ee5d6.mp3";
// export const level14P4ThreeSAudio = "1a5c9b5e-e246-4021-a2e9-3107c8b789c9.mp3";
// export const level14P4FourSAudio = "79ab7ec7-b8a1-4446-a7d5-a28284f299d0.mp3";
// export const level14P4FiveSAudio = "993c20e1-bc2b-47f4-ba11-5bb935e2b370.mp3";

// export const level14P5OneSAudio = "738fe2bd-4419-45aa-aeeb-ab3c9fd2edde.mp3";
// export const level14P5TwoSAudio = "470aafff-112a-4497-93c8-0359046e5a71.mp3";
// export const level14P5ThreeSAudio = "b599d72d-45f5-425d-b17b-31fcedbbf41c.mp3";
// export const level14P5FourSAudio = "6442a431-a930-42c9-9f6d-856fc72fb5df.mp3";
// export const level14P5FiveSAudio = "b3fcfa88-3ef8-4dc1-82f1-976a776f76bc.mp3";

// export const level14P6OneSAudio = "22e1fbd5-a829-4e96-b50a-de20c60d68d2.mp3";
// export const level14P6TwoSAudio = "55c5f3d8-d783-4bba-837d-84f05169e11a.mp3";
// export const level14P6ThreeSAudio = "f3d86696-50ff-4e46-9b18-3c92b3ba855b.mp3";
// export const level14P6FourSAudio = "2a635093-11de-4396-9b17-7b5014fe0c1f.mp3";
// export const level14P6FiveSAudio = "33209867-fe34-4b90-bf54-168a45455b56.mp3";

// export const level14P8OneSAudio = "b16aa336-5e24-49b8-a7ea-e5c6c8ce6e82.mp3";
// export const level14P8TwoSAudio = "fa7725f1-e9f9-493f-99cc-0743104d5fdb.mp3";
// export const level14P8ThreeSAudio = "a576d4d6-b95f-429f-b315-e582991dc2b6.mp3";
// export const level14P8FourSAudio = "0f4b5438-2b79-43a3-a322-7c591cf89927.mp3";
// export const level14P8FiveSAudio = "f7f7d73f-3986-4da9-b5f0-59e3492f4d6b.mp3";

// export const level14S1OneSAudio = "eed23620-f734-40b3-a241-9836de34bb9c.mp3";
// export const level14S1TwoSAudio = "38e95049-0b74-4253-b442-5d0be201fad6.mp3";
// export const level14S1ThreeSAudio = "ca8a0083-f1ae-41e7-86e4-fbc641d91a3b.mp3";
// export const level14S1FourSAudio = "dd87b5f5-2270-4f11-ae68-91c805e15752.mp3";
// export const level14S1FiveSAudio = "d9256cd0-5c9c-4c9e-a3cc-0811f4e19258.mp3";

// export const level14P7OneSAudio = "a8627ff8-c34b-44e8-8a50-867d94b152b3.mp3";
// export const level14P7TwoSAudio = "8d96a46d-f2ee-453b-b411-92de2e06dfd7.mp3";
// export const level14P7ThreeSAudio = "23db7e05-ca87-474b-bad3-ab62aed89501.mp3";
// export const level14P7FourSAudio = "ca41c2e7-5b77-4dd1-b232-aa7e9daf8913.mp3";
// export const level14P7FiveSAudio = "9b3cd9ff-7e49-40bb-b7fb-40dfb94c73f6.mp3";

// export const level15P1OneUAudio = "21c03e04-7172-4800-9c41-1e44713c9106.mp3";
// export const level15P1TwoUAudio = "afdf7ab8-02d6-4c47-86a2-70f2a472b3f3.mp3";
// export const level15P1ThreeUAudio = "f3eadd72-4843-4121-8667-42704bcb2660.mp3";
// export const level15P1FourUAudio = "d2ca7e2a-aa3e-4276-87f8-0d2b42417130.mp3";
// export const level15P1FiveUAudio = "6a4efd78-3fa6-42a1-bf80-07ccede10ace.mp3";
// export const level15P1SixUAudio = "7b677b68-95c6-49c9-a7bf-aa075c693879.mp3";

//M15P2
export const level15P2OneAudio = "75db381c-6897-4f09-a897-22ad35084549.mp3";
export const level15P2TwoAudio = "0d573625-9236-42f6-927f-447694c8c677.mp3";
export const level15P2ThreeAudio = "54534a3b-c929-45b0-a907-4b094fb0255c.mp3";
export const level15P2FourAudio = "5c405ac4-26ce-426c-a8ba-7948252ed033.mp3";
export const level15P2FiveAudio = "34814e9e-7ea5-4aa8-950e-0284290ec8f0.mp3";

//M15P3
export const BeltAudio = "b7f4811e-c22b-4b58-a527-7a3e592d5a12.mp3";
export const WatchAudio = "13cf3563-13ca-4e6d-8637-8a274843cd40.mp3";
export const BraceletAudio = "94cc00c5-8509-4f4a-b3f3-07063680efdd.mp3";
export const PenAudio = "ec7a8caf-7b52-4338-8fcb-131caadacbb5.mp3";
export const ChalkAudio = "c1e5bd6e-8bd5-4954-8996-ededed4d930b.mp3";
export const EraserAudio = "1ef31155-93a1-4e0e-b000-4f301dd23ac6.mp3";
export const GlovesAudio = "d2cd8413-6603-4014-a178-13bbd18af348.mp3";
export const ShoesAudio = "b0b10722-4bdf-4da9-810b-e5f08b37d0bc.mp3";
export const CapAudio = "0ac3a347-6283-449f-a6a6-ebc8b766ef1d.mp3";
export const FlashlightAudio = "a9d83e01-bc6a-461c-a58d-5c1d6beaba86.mp3";
export const MirrorAudio = "b0921507-e770-4b4d-9698-e61ec7eb7b71.mp3";
export const RulerAudio = "ca0658fa-c006-4b0a-8ba0-5e5f95c72726.mp3";
export const LunchBoxAudio = "9326ba7a-4470-4e51-8aa2-e07d2d6770d5.mp3";
export const NotebookAudio = "7e4c11e8-955d-40ad-b474-0629b7738f69.mp3";
export const ToyAudio = "63b5107a-9d0a-4454-b4ad-24c07c9f4750.mp3";
export const PillowAudio = "93e7e25d-12ee-473b-8e9a-39724504633c.mp3";
export const BasketAudio = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

export const BookAudio = "bddedb76-c5fd-4fb7-910b-8a760bfc132b.mp3";
export const KeyboardAudio = "bfc9b38c-abbc-4ce0-8982-8e994a00faee.mp3";
export const TeddyBearAudio = "eeecf97d-8373-40fa-b9ee-59659a1f5458.mp3";

export const TabletAudio = "cdfd35af-aeae-4799-bf32-5c5f6fdada75.mp3";
export const ClockAudio = "fa2765ad-47cb-4d48-9537-1fe8b62b3e1d.mp3";
export const BottleAudio = "af6bc5b2-6fb0-445b-a961-f30348560e6e.mp3";

export const TelevisionAudio = "114dc5e7-00cb-4959-8900-2fb5c26f2d91.mp3";
export const ChairAudio = "2407000e-b5d3-4aef-ab2b-9e17e7fc99d7.mp3";
export const TableAudio = "29c089b4-94c3-41d8-91df-e72fe99a920b.mp3";

export const GuitarAudio = "706ffbce-efc7-4221-a78a-1b4485ddc20c.mp3";
export const PianoAudio = "b54dd467-d711-4b87-b37e-c1cfc617875e.mp3";
export const ViolinAudio = "bb55860d-f416-4c55-a2de-283650ac7e44.mp3";

export const SnakeAudio = "a62ea2e7-3424-44bb-98fa-ca4235041609.mp3";
export const CrocodileAudio = "711bbedc-c331-4b15-bfe3-fd423526d590.mp3";
export const LizardAudio = "49141134-5618-470f-ba86-fef7ca818af4.mp3";

export const RhinoAudio = "deb70a42-0c9b-4274-aba9-aa2de9319085.mp3";
export const HippoAudio = "9097ef2e-3db0-488e-95e9-370ebb25157f.mp3";

export const ElevatorAudio = "07bef3aa-2f48-4d6e-a7be-4441b98aea3a.mp3";
export const SeesawAudio = "f48e5b2a-f8de-40e2-8240-ede354c04bbe.mp3";
export const StaircaseAudio = "8056a2a1-543f-4ffc-9ad9-530731d9a045.mp3";

export const CloudAudio = "420031e4-c82f-4867-a1df-06f2519f4155.mp3";
export const BirdAudio = "7b5a1a9c-7c92-46a1-aecd-3b5069df9191.mp3";
export const WindAudio = "d5528aea-75dc-44fb-bd48-4b6762456f02.mp3";

export const MicroscopeAudio = "0015a84a-a290-4c87-b4bc-14bd77295406.mp3";
export const TelescopeAudio = "a98d75c8-9b2d-45c8-a419-741690ce7928.mp3";
export const BinocularsAudio = "855cb7b1-4c68-4b93-964e-2908cfbb5cd2.mp3";

//M15S1
export const level15S1OneUAudio = "41897884-e79b-4f80-bd07-2b9436a0ff4f.mp3";
export const level15S1TwoUAudio = "1b33b69c-b1e8-48ff-91cb-526f3255a7cc.mp3";
export const level15S1ThreeUAudio = "a53fe531-9a5d-471b-a761-88f1c752f25f.mp3";
export const level15S1FourUAudio = "5e0597fc-2a68-4b2f-8e5e-5b233a829dbc.mp3";
export const level15S1FiveUAudio = "e6f56b1f-f978-4778-b9f9-d9d7470ea494.mp3";

//M15P4
export const PenguinAudio = "3b1a1b7f-3b18-49b9-ad8d-ccfee740916b.mp3";
export const EagleAudio = "27cbc3f5-6138-4725-ad10-fdbb3bf605f4.mp3";
export const DuckAudio = "77761273-f075-489c-a9f0-c51ad4f24c25.mp3";
export const HorseAudio = "e708b1cd-13d9-4d7e-8be1-a27dfd53bbd3.mp3";
export const ElephantAudio = "36e64a0a-1757-4e6a-b2ad-ab465efd914c.mp3";
export const GiraffeAudio = "711a2715-1633-48f8-a1ea-8902f0cb9904.mp3";
export const RabbitAudio = "1e216475-748a-409d-9656-eb67a1251479.mp3";
export const CatAudio = "37b2bf4e-9c7e-47fa-b8e3-fc63f77482e9.mp3";
export const ParrotAudio = "60358dc3-749f-4b50-b469-464237e11b4a.mp3";
export const TigerAudio = "5f5c440d-f421-4ae5-bc28-d4fb98ad7578.mp3";
export const LeopardAudio = "cf747989-8f92-4a6d-b267-84f9b48b660f.mp3";
export const CheetahAudio = "f728f950-0506-47ee-8534-589e5951ce20.mp3";
export const CowAudio = "2f1c4637-3e1b-4aa2-99ce-0f6339390742.mp3";
export const SheepAudio = "758ee4d8-216b-43e7-8fec-b64d43c4420a.mp3";
export const GoatAudio = "27724b3a-c1b2-4588-b429-cc82705a673e.mp3";

//M15P5
export const TomImg = "4f39285a-6d64-4f78-b01c-d273909a5fc5.png";
export const JerryImg = "80700e62-31ba-4341-bbe3-f60e10a12a93.png";
export const level15P5OneUAudio = "aa806828-dda8-4cfd-8150-29799a736d82.mp3";
export const level15P5TwoUAudio = "14dced6a-fe81-4e91-b679-348b34fa3598.mp3";
export const level15P5ThreeUAudio = "ddfebe41-95a4-4d37-adf2-0b3953e10d74.mp3";
export const level15P5FourUAudio = "6a0592ed-f011-4672-beba-5b0d5efd7826.mp3";
export const level15P5FiveUAudio = "8064d9a2-79b8-4299-b420-c63871cfa059.mp3";

//M15P6
export const level15P6OneUAudio = "913bc72e-7840-40f0-a385-5d1f7fd6f9be.mp3";
export const level15P6TwoUAudio = "890187d2-2c9c-4177-883a-b8e118c5d5c0.mp3";
export const level15P6ThreeUAudio = "be2b5bf2-2c0a-4eef-bcc4-18c9973d2098.mp3";
export const level15P6FourUAudio = "e2a124af-b470-432f-b869-e5c431f58e6f.mp3";
export const level15P6FiveUAudio = "3eb3f536-d079-4f05-a68d-2e50c0ffc228.mp3";

//M15P7
export const MeowsAudio = "37b2bf4e-9c7e-47fa-b8e3-fc63f77482e9.mp3";
export const BarksAudio = "ccecdbaf-389e-4643-af53-6258fae7c6fb.mp3";
export const HissesAudio = "57742111-7c66-4560-933e-f22203a37352.mp3";
export const mooAudio = "c6e983c9-9ed3-4686-aa91-322474965d66.mp3";
export const NeighAudio = "b6c36f57-6929-4cf0-852a-642c2e24abf1.mp3";
export const MonkeyAudio = "0b3e2773-d25c-478b-90d4-27844ed13dd4.mp3";
export const LionUAudio = "ae727979-7e66-4a15-aa57-08faec0407aa.mp3";

export const GrowlsAudio = "01148517-c439-4557-8b48-571d830eeae0.mp3";
export const RoarsAudio = "d1df5b6c-bcdd-42d8-9b34-e969e9c7fef5.mp3";
export const SnarlsAudio = "d04fa173-64e1-4296-9a97-c8ca29ed7b01.mp3";

//const ElephantAudio = "6fb1684e-20d3-4aa2-b3c2-daec489367bc.mp3";

//export const BirdAudio = "d80a5bff-6525-43e0-b46d-3e6da26c4adf.mp3";
export const DogAudio = "ccecdbaf-389e-4643-af53-6258fae7c6fb.mp3";

//const HorseAudio = "e708b1cd-13d9-4d7e-8be1-a27dfd53bbd3.mp3";
export const LionAudio = "6c228f8d-0a7b-463f-9f98-c3a25c41ebba.mp3";
export const neighAudio = "e25ea8f7-a24f-489e-a7b5-1fe05c9fcee7.mp3";

export const childImage = "0fa4b96c-b5d7-4d5b-9916-87ca004237c4.png";
export const boyFromSuperMarket = "c9c58580-7d91-4380-bd08-44dfcf91e808.png";
export const mallImage = "c9c58580-7d91-4380-bd08-44dfcf91e808.png";
export const supermarketAnouncementImg =
  "e0b78bf7-7249-4c13-bf2d-d947bee6252b.png";
export const superMarketAnouncementAudio =
  "b4f45bff-6f5a-44e9-869c-aaae6dfb03b9.mp3";
export const coconutM1Eng = "6ca98ad5-d0f7-4880-90c7-3943ac5c3707.mp3";

//Reference Audios

export const packingTripAudio = "55477e59-7141-4f80-9df3-22697809a6a6.mp3";

// export const level15P5OneSAudio = "2c545c32-ee2b-40a8-86ff-428e8a571566.mp3";
// export const level15P5TwoSAudio = "d73dcefb-aa5d-4a51-8057-78c449d7d9cd.mp3";
// export const level15P5ThreeSAudio = "a785d3ba-fb37-4ebe-b0e2-5045117bce8d.mp3";
// export const level15P5FourSAudio = "f4dd4adb-98c5-4521-a39c-1c166dee88fb.mp3";
// export const level15P5FiveSAudio = "52e8de57-14d7-4e76-aeae-31eefbc3fd19.mp3";

// export const level15P1OneSAudio = "f0db478d-69c1-4199-ab5e-9152afd00794.mp3";
// export const level15P1TwoSAudio = "14c59733-761f-4534-9736-6df1ab9944a3.mp3";
// export const level15P1ThreeSAudio = "eea07d04-2295-414d-892f-74fe50bb7aa6.mp3";
// export const level15P1FourSAudio = "fd5b366d-af34-4859-aaab-c955c8da8130.mp3";
// export const level15P1FiveSAudio = "bffd5dff-7131-407a-8f75-6843326d0266.mp3";

// export const level15P5OneUAudio = "c8f5e4ac-8f0e-4ec4-bbfa-ed53daed9359.mp3";
// export const level15P5TwoUAudio = "e4791c9a-f266-4531-a23d-08442facbe2a.mp3";
// export const level15P5ThreeUAudio = "dda8e06d-ee7d-4e7c-846e-6d307e9dc6eb.mp3";
// export const level15P5FourUAudio = "e03a3e93-4c87-44a9-ac67-b1f231004516.mp3";
// export const level15P5FiveUAudio = "0de8e127-e306-4c22-adfd-afe2e9de505b.mp3";

// export const level15P6OneUAudio = "aacfb8c7-2069-407e-ac9a-c0424a851472.mp3";
// export const level15P6TwoUAudio = "fa47dc7b-283e-42e4-8b68-3d560150d559.mp3";
// export const level15P6ThreeUAudio = "2c5c2400-54c4-44db-98cc-06b7be532ccf.mp3";
// export const level15P6FOurUAudio = "243b98bc-923a-4ddb-a6de-385624d131f0.mp3";
// export const level15P6FIveUAudio = "ab3cbcab-f5b1-4e7f-86b9-f79ebe27d2cc.mp3";

// export const level15P6OneSAudio = "bc292feb-8212-4a9b-966d-663946b15a75.mp3";
// export const level15P6TwoSAudio = "ede7498c-7feb-407e-9cbb-6b02431b1d71.mp3";
// export const level15P6ThreeSAudio = "6a0e3bb2-896a-46d5-91fc-b7091947d356.mp3";
// export const level15P6FourSAudio = "5b7ca783-c781-45de-947e-bb8ce566680b.mp3";
// export const level15P6FiveSAudio = "71289f70-33c3-4c8b-ae9f-6af062b7cac5.mp3";

//Reference Audios

// export const coconutM1Eng = "6ca98ad5-d0f7-4880-90c7-3943ac5c3707.mp3";
export const animalsM1Eng = "72139e23-f554-4361-ad3e-cce3ecd07fb2.mp3";
export const appleM1Eng = "0a5ca155-a486-4507-93ac-e28e7fca9ce4.mp3";
export const tableM1Eng = "a7121af9-09ee-47e9-808f-5e5273acf761.mp3";
export const mangoM1Eng = "63e6245f-9299-4864-a035-1b8518689509.mp3";
export const pencilM1Eng = "fde646c8-b0c3-450e-bec6-de8b092d1f94.mp3";
export const monkeyM1Eng = "1cf0cfe2-dc47-4d6f-8a82-f8a1905ffa01.mp3";
export const bicycleM1Eng = "8a075f16-8853-4f53-abd0-59a9823eb6d0.mp3";
export const glassM1Eng = "7ff02a2e-0521-4d32-bd21-413bf050ceb9.mp3";
export const orangeM1Eng = "392b5a00-5264-48ed-af88-591dac179592.mp3";
export const numberM1Eng = "997c428f-a43c-4a4f-ac62-d0a65eb6cae0.mp3";
export const sleepM1Eng = "36245a60-0d68-47c2-9764-58b28bb398f9.mp3";
export const bananaM1Eng = "e01ab927-cffb-4918-85ed-9d773aef0c74.mp3";
export const elephantM1Eng = "ecdd9f68-d6ce-44b1-9718-7642fc121784.mp3";
export const basketM1Eng = "5a85e9f1-85d8-429b-9327-cc773254a5ac.mp3";
export const calendarM1Eng = "f17cfc85-1815-49db-ba30-3efd82437ea4.mp3";
export const zebraM1Eng = "f776dae3-de00-4cad-808b-dd06fe7b42ba.mp3";
export const lionM1Eng = "3df94bde-e32c-427a-82af-ccdc740f34a5.mp3";
export const doctorM1Eng = "05d55323-11a6-41c8-89a6-8d39344e2799.mp3";
export const horseM1Eng = "aff3bd06-fe49-436e-9ec5-7cca658fdbb5.mp3";
export const tigerM1Eng = "ec1acc7b-0b3e-46fa-8eac-280cb289dd7e.mp3";
export const spoonM1Eng = "c517393e-4df6-4d92-bcbe-0fc59e390c39.mp3";
export const wheelM1Eng = "eb4009e8-289a-4f95-bc59-a73c5642115a.mp3";
export const puzzleM1Eng = "df79c682-ca98-415a-a44d-2a97579f75c8.mp3";
export const tomatoM1Eng = "fd9d8fb6-d267-47f5-a607-426f97380f3f.mp3";
export const windowM1Eng = "60067a21-ab87-4e91-88cf-e6f188711cfa.mp3";
export const dragonM1Eng = "abbcdd42-b4d8-4fcc-bd73-668a0d992d32.mp3";
//export const cameraM1Eng = "11ac3672-dccb-4ae9-a324-bc4e8712480f.mp3";
export const kitesM1Eng = "d2c43ae3-3ce1-4fa0-bfd5-6c3895bd1b90.mp3";
export const potatoM1Eng = "f1cfc4b1-7ec6-47ce-8740-cb7d4b11a77f.mp3";
export const balloonM1Eng = "eb0803f3-f255-4c2d-8c21-36baf4003c73.mp3";
export const dustbinM1Eng = "7c24e5c9-c705-4aa0-99ef-06863b72fbd5.mp3";
export const familyM1Eng = "400732b9-985b-4755-ad83-7971bfad6e98.mp3";
export const plantsM1Eng = "9573dc12-c291-4c07-937e-84a5368d4958.mp3";
export const happyM1Eng = "b0c44e88-0b91-4c6e-94fc-1fc77b22c69d.mp3";
export const spiderM1Eng = "acc70691-89be-4825-8d1f-08e990368aaf.mp3";
export const fruitsM1Eng = "a8756554-a353-4c55-8f22-9fed9b59d608.mp3";
export const handsM1Eng = "67900450-9f43-41eb-871a-2dd9f2d6bab7.mp3";
export const keyM1Eng = "274c1dcc-8543-4b4e-aeef-1b0daaf7ffca.mp3";
export const turtleM1Eng = "e4d78ab1-3ee5-4595-a09d-bc02d499a8a6.mp3";
export const stonesM1Eng = "0f9f1e3b-2063-4250-b854-9c675f324df6.mp3";
export const cardsM1Eng = "c2da7729-7452-4c9b-9d0b-73a284b2b525.mp3";
export const vegetablesM1Eng = "ae42d8a7-6cf4-4c18-91fd-14df0c737231.mp3";
export const phoneM1Eng = "950defd6-5c05-4fad-ac71-4c639db2a328.mp3";
export const moneyM1Eng = "4fd9d463-3ff6-48eb-b0a6-e525e6a9166d.mp3";
export const tongueM1Eng = "b58a3e85-f577-42de-bf2d-a06e81498a20.mp3";
export const grapesM1Eng = "f8db89d0-c662-4974-b5e5-68feb378696b.mp3";
export const clockM1Eng = "d8bc8134-0432-4a36-b7d0-f1f33359adf0.mp3";
export const puppyM1Eng = "58f982bb-6ed5-4acb-a64b-e5b008fceb2c.mp3";
export const peacockM1Eng = "75fe967d-1330-4f43-9558-1feb8c5136c1.mp3";

export const teacherM2Eng = "7f896d72-04ce-406e-a9aa-3e7884ff98fc.mp3";
//export const cherryM2Eng = "c96a9d22-7918-4b7d-826f-4197fd075016.mp3";
export const dragonflyM2Eng = "4fc6c12e-9e48-4ec3-bc38-34ba80035c24.mp3";
export const woollenM2Eng = "7f7532ee-bf50-466b-a407-9d3c53d88bad.mp3";
export const footpathM2Eng = "99eee7a8-20a4-474e-ba1b-b41f93af937f.mp3";
export const chocolatesM2Eng = "adb677ce-c783-4c8d-a925-f3dde133a944.mp3";
export const sproutM2Eng = "503a7257-96a3-4884-9316-e43ff63d40a5.mp3";
export const clownM2Eng = "7b6e9303-546b-40fe-85a8-10e874312c0a.mp3";
export const utensilsM2Eng = "7bf39916-1106-47fa-b30f-aedf77bae4c2.mp3";
export const handkerchiefM2Eng = "e0e1ad47-fa1f-442e-a525-4e8754dc1382.mp3";
export const flowersM2Eng = "6e0f185a-c97b-4a02-995a-fcde578ab051.mp3";
export const mountainsM2Eng = "80010b69-012b-4c17-89c5-d6661af1115f.mp3";
export const thinkingM2Eng = "d84199d5-60f2-4bde-a57d-e1a472c920cf.mp3";
export const sugarM2Eng = "cc220d86-741b-4bcd-9e65-6fe3df220444.mp3";
export const chairM2Eng = "d06800bb-baad-40a8-a4a1-bad2544158fa.mp3";
export const teethM2Eng = "9d50e401-b7ce-4c7a-8438-7004d13cdf02.mp3";
export const cloudsM2Eng = "08bc5a21-d8de-4863-a3f5-29163ad8029e.mp3";
export const bookM2Eng = "40bf3e5f-0ef9-49b6-881c-35740b36339a.mp3";
export const kitchenM2Eng = "c7b6dac3-bfaa-45a6-939a-de0a138d5d28.mp3";
export const mouthM2Eng = "1b8c125a-06a3-446f-8f0d-be76e6e74e84.mp3";
export const drawingM2Eng = "aa22d175-706c-45ca-b450-9c85812fa88c.mp3";
export const mouseM2Eng = "25eda8ce-1cae-4a9f-8b67-09d65728ddca.mp3";
//export const musicM2Eng = "ff80022d-67b8-48cd-9dc1-7ff0b65256df.mp3";
export const lunchM2Eng = "9d030546-ebbf-4a52-a30e-b339e1cc44ee.mp3";
export const clothM2Eng = "b2cf1e46-c5c3-41e5-a2d7-a300ef546c58.mp3";
export const goodbyeM2Eng = "0ec29f46-09be-4eb3-a697-74f615ce0f52.mp3";
export const textbookM2Eng = "5ebf562d-41a7-4e6a-b4cc-a14c138d839d.mp3";
export const earthM2Eng = "478346fb-2342-4338-841a-53ee6e5b6b3d.mp3";
export const oilM2Eng = "fd2d6346-8afc-4e76-bb78-fd1721f03e02.mp3";
export const aeroplaneM2Eng = "624125e2-d2c0-48a4-ae61-5900e2632962.mp3";
export const championM2Eng = "ae4499a4-cb44-42c9-a3f8-4bdcc20a3bc5.mp3";
export const cookingM2Eng = "420e9650-6340-413b-9a09-b5442eec3a6e.mp3";
export const sandcastleM2Eng = "aaafaaa3-b6fe-425f-ac07-b1340e0f9969.mp3";
export const warriorsM2Eng = "ef66778e-3c23-4b6c-8757-24705b5d7634.mp3";
export const mathematicsM2Eng = "0e9c54ec-2022-4a38-885b-3f81fbf2dde4.mp3";
export const branchM2Eng = "2fd6e773-fc71-4a42-81e9-08ee9057687d.mp3";
export const jackfruitM2Eng = "34fbc770-3381-49b4-be27-b1130216fba6.mp3";
export const beachM2Eng = "1253c7bb-3702-49a5-afaa-72c1744ca4d4.mp3";
export const womenM2Eng = "9a3e31ad-c558-4c3c-96e1-1493fbae915a.mp3";
export const soundM2Eng = "561d9390-d726-495a-bb51-7c74e271705b.mp3";
export const houseM2Eng = "512c3a18-6501-4639-a797-5cc79c99d734.mp3";
export const grandfatherM2Eng = "30a5223c-0ebf-46b0-815a-a15bac7b7f88.mp3";
export const notebookM2Eng = "c8bf42a4-f553-4d5c-bcc3-032f28666fe4.mp3";
export const curiousM2Eng = "6276af28-896a-4563-a695-a0119dbdb01e.mp3";
export const lecturerM2Eng = "a3e55d8e-6e01-40dc-a633-782dec61edbb.mp3";
export const monumentM2Eng = "f2be3964-72a1-41ae-9c99-d4a33a7c17c5.mp3";
export const stichM2Eng = "d37f940a-5af2-40b5-9a97-aef74caa2417.mp3";
export const cheerM2Eng = "68276437-b3f3-4995-aa0b-510e67454eb1.mp3";
export const brothersM2Eng = "a895c64e-7fab-4c42-bbde-e4e2ca14352d.mp3";
export const joyfulM2Eng = "e27df846-9d7b-44bc-9193-c54e1228b89a.mp3";

export const baadalM1Hin = "586cb504-53a0-4daa-b948-0161d42bb975.mp3";
export const tablaM1Hin = "e8446123-c204-4621-ab56-218a7e2f36fd.mp3";
export const chaavalM1Hin = "db5fbedc-d09c-4e33-ba9e-99abc5fe4de0.mp3";
export const koelM1Hin = "6a8d5c60-d53b-4a97-a831-384234b08deb.mp3";
export const kalamM1Hin = "c4191589-fe8a-4fc4-b62d-849f38f02ab3.mp3";
export const matarM1Hin = "d88aa8d1-47d0-4002-b6bc-10a8f3f4fb41.mp3";
export const palangM1Hin = "97ae82bf-d4d3-423b-9fe0-00745b0be51a.mp3";
export const matkaM1Hin = "56bf981d-d12f-449a-b78e-6970e9a41921.mp3";
export const mandirM1Hin = "194710db-0c13-4a5a-a355-9cec19263139.mp3";
export const kadduM1Hin = "324c120d-c52a-40e9-a94b-d2091c054689.mp3";
export const santraM1Hin = "0b44a162-bf7b-450b-b630-3c3624371c80.mp3";
export const bottleM1Hin = "f2ca224a-b9d1-4241-ae34-48cfb924bee2.mp3";
export const bakraM1Hin = "0e03ad7e-c47a-48d9-ac1a-61c70f1894de.mp3";
export const achaarM1Hin = "64477069-1dea-4260-bd8b-16ca8813d785.mp3";
export const dumrooM1Hin = "64fde5d4-4d57-4b29-8e2c-b9b9c4422ec3.mp3";
export const takiaM1Hin = "1988131b-cebb-476a-b5ac-985463817ab1.mp3";
export const teacherM1Hin = "69977348-ee0f-4be1-898c-ef52161952fd.mp3";
//export const bandarM1Hin = "21e50c46-ecf0-4401-b0bb-b32cc8698007.mp3";
export const langoorM1Hin = "7e13fa46-2f9f-4286-b8b0-8e675eec3ad6.mp3";
export const gaajarM1Hin = "f94efb34-906c-423e-9109-ab04e93c8061.mp3";
export const hiranM1Hin = "2e29070a-4cfa-483c-8d27-78f35ab4acc0.mp3";
export const soorajM1Hin = "2931aab7-c875-41c6-82f2-e36407e05588.mp3";
export const glassM1Hin = "896d35ac-cf9a-4679-97a3-05f18f98827f.mp3";
export const naukaM1Hin = "0257f0fc-8eaf-4268-bc66-5b1699b11548.mp3";
export const pedM1Hin = "553c149a-ec53-4cfa-9343-7fa94bbec305.mp3";
export const gendaM1Hin = "b531e140-740c-4336-be95-f146f012e1d2.mp3";
export const sarasM1Hin = "c594042f-8476-4486-bb08-e2fcac0143e9.mp3";
export const tirangaM1Hin = "6d08e74a-12bc-45cb-b234-c6dbff220229.mp3";
export const pagdiM1Hin = "ec284410-a247-4727-800b-0411f06d3f29.mp3";
export const batakhM1Hin = "f1cdbef4-b826-4efb-8179-32443fa65d0f.mp3";
export const paisaM1Hin = "19c78105-ddbf-447b-8757-17cbeaec633e.mp3";
export const cheentiM1Hin = "a3625f52-4340-48bb-9958-7bd2624ddfea.mp3";
export const kheeraM1Hin = "acfa670d-5262-464b-9f89-fe843da16747.mp3";
export const bheD_M1Hin = "7d5b456a-af08-4cf5-8c11-af78c140d78c.mp3";
export const chabiM1Hin = "db34ded4-2034-4369-b8be-63233261bc37.mp3";
export const rotiM1Hin = "2f1f9107-2e48-4319-a2c7-073c833d595e.mp3";
export const mooliM1Hin = "d9c433f9-7af4-4adb-8382-20cc88d318c3.mp3";
export const lichiM1Hin = "bb03beba-5bd5-43bb-bd9a-8cf21c002b86.mp3";
export const neembuM1Hin = "f2edc2bf-2851-4222-8dd1-05a3bed04c16.mp3";
export const holiM1Hin = "7d293dcf-283c-4070-8e70-db58d4b8bc8a.mp3";
export const kelaM1Hin = "18fe9572-66c2-4322-8027-2325d9910f0c.mp3";
export const bhaluM1Hin = "09f5cc93-a27e-443a-acd8-b9a0556bec33.mp3";
export const gobhiM1Hin = "57d33683-3435-47de-a6e8-e912926bebdd.mp3";
export const chuhaM1Hin = "90164fc1-80c5-43f9-9797-5b76d03439e1.mp3";
export const ghodaM1Hin = "0f3c9621-6719-47d1-acd6-d94f03abceac.mp3";
export const moochM1Hin = "4778be90-b1e1-4efe-b42f-3b4bdab5de62.mp3";
export const laukiM1Hin = "1c4a8244-3762-4da9-87d0-cee86459fa03.mp3";
export const towerM1Hin = "c576e818-31d6-47ea-a200-a4989e646f58.mp3";
export const naniM1Hin = "26d4e53e-429d-472f-9077-bc96782c9062.mp3";

export const khelkudM2Hin = "7672fcdb-fc9a-4057-9deb-fd2f00bac5bd.mp3";
export const mobileM2Hin = "92bc1754-d195-4dd1-a7d0-a96cbcf6f447.mp3";
export const helmetM2Hin = "6983389e-edc2-4801-ab01-35217d159bf3.mp3";
export const bandgobhiM2Hin = "bfa3945b-07fe-48ce-b0c1-2c67bedf3ba1.mp3";
export const moongphaliM2Hin = "135be8da-cb9b-492d-9656-da821664ff37.mp3";
export const doctorM2Hin = "66feebe6-2270-4452-9253-99c918fe4d3a.mp3";
export const masjidM2Hin = "f308078d-c81e-45ce-bfb4-f0545c7ffdc4.mp3";
export const gubbaraM2Hin = "4a9706fe-57f1-4e73-9aeb-1546e92286ce.mp3";
export const machharM2Hin = "69d4981a-a823-45df-a711-718d8011edac.mp3";
export const scooterM2Hin = "1777d1a9-7512-4ecd-a3e0-a30901c27ace.mp3";
export const mirchM2Hin = "c4990fa4-1a65-40f0-9102-48d805cb13ae.mp3";
export const gulabM2Hin = "eafeefc7-0c34-4c31-9832-2da3af8736cf.mp3";
export const basketM2Hin = "ee04f2d7-d70d-4383-b89d-b030b642182a.mp3";
export const circusM2Hin = "364fa060-1bb3-4e4a-a763-9bc1dfc3828d.mp3";
export const krishnM2Hin = "1c84605e-7ff6-4c49-9b7e-29b6aece4776.mp3";
export const parvatM2Hin = "99041ffe-1d08-4d0b-8e89-5098feba42da.mp3";
export const bhindiM2Hin = "11779ffd-e004-49ee-841b-68e7d505feeb.mp3";
export const kulhadiM2Hin = "28fd5a79-8fcc-4a8e-b8e9-63e333f06180.mp3";
export const tyohaarM2Hin = "7d46625e-aa58-46ab-a66d-5bf6bd6aecf9.mp3";
export const kasratM2Hin = "69123bfb-7023-47ad-a78c-612b7d869efc.mp3";
export const shalgamM2Hin = "7b0be858-42fd-4929-8721-2b520b709c5d.mp3";
export const ajgarM2Hin = "ac50190a-f68c-47ef-a94d-ff03283e2d3c.mp3";
export const adrakM2Hin = "7ef1938b-e331-4bcd-9fb3-e723d4e0f436.mp3";
export const sardarM2Hin = "2a837910-9e4a-43b8-b768-c3eca3b1cb2b.mp3";
export const sharbatM2Hin = "4350c341-433a-499f-a69c-47554d24b128.mp3";
export const kathalM2Hin = "8f80bd2e-7e6c-47b9-8e24-695d4ea5ec0c.mp3";
export const tamatarM2Hin = "5f1acc5c-24a0-4548-a72e-a5d20e274de9.mp3";
export const girgitM2Hin = "2874528a-d652-45f6-b895-105a87a583d4.mp3";
export const tarboojM2Hin = "f114b1e1-fbd3-46ba-b63c-6dd6ec6a8460.mp3";
export const kabootarM2Hin = "96744cd3-b657-449d-851c-6f40d6ebe4c6.mp3";
export const nariyalM2Hin = "98f661fc-bb47-40ed-a630-0080375d5450.mp3";
export const chocolateM2Hin = "b9ccb17a-761e-4249-880d-a10c9422170a.mp3";
export const cycleM2Hin = "9d78947e-a869-45c7-8e2a-e6bf3361f4cd.mp3";
export const footballM2Hin = "729243a2-d668-48c5-9958-6f05bd78718e.mp3";
export const lahsunM2Hin = "1370431d-99b7-49dd-a953-44e487419833.mp3";
export const khargoshM2Hin = "b811d63d-ed15-423b-b6a6-54b6b96bad49.mp3";
export const phooldanM2Hin = "76f9e19b-8cfc-4834-9312-36a5533890af.mp3";
export const gilhariM2Hin = "e24376fb-a4eb-4598-80dd-4e87c057c7ad.mp3";
export const elaichiM2Hin = "cb408b5a-f8c1-47b5-be5c-900371fe0712.mp3";
export const kharboozaM2Hin = "f11158fd-d988-4f33-925b-ece8b88b2263.mp3";
export const battakhM2Hin = "d962cd1e-632d-4869-a25b-dc5c974c9e01.mp3";
export const pattharM2Hin = "a4dd5012-b5a6-42d7-8403-205729039dfc.mp3";
export const biscuitM2Hin = "954b471e-bf4c-45d1-ba3a-54f767cd8870.mp3";
export const kulfiM2Hin = "e5eccc19-4808-40ba-8ef1-338d7b9e0e0b.mp3";
export const bistarM2Hin = "e1f0ab40-a68b-4bf2-80f5-794db3811353.mp3";
export const prithviM2Hin = "6a80cc69-f678-41d5-be26-049f2fd11dd1.mp3";
export const shikshakM2Hin = "701b6cb0-a120-43c6-a9ac-2118c57fd268.mp3";
export const sardiM2Hin = "2ad08e66-3cd3-4d81-8fed-435e45d5263a.mp3";
export const chikitsaM2Hin = "1af41ce9-8aab-4589-8a53-65a03f5344d8.mp3";
export const murgaM2Hin = "78dc124c-20f4-4935-be19-2d6d1592a505.mp3";

export const YoungM1Tam = "bd0c06d0-c369-4998-b225-47c14310c99e.mp3";
export const blindM1Tam = "5b9d53ca-517d-434b-b513-b2403f5358a0.mp3";
export const SHOEM1Tam = "b7b2576d-d06a-462e-966b-e7e747a7bc9e.mp3";
export const sailorM1Tam = "9c3a4daf-61f7-4db2-9811-1da6cdf57ca3.mp3";
export const mushroomM1Tam = "cb1e6e75-1ef9-4a00-837b-f44f2ae7bb7f.mp3";
export const FoodM1Tam = "b5ce5427-6d74-4fd2-a14c-bedc9c5ba0c5.mp3";
export const RiceM1Tam = "aa1635a5-460e-42ee-960f-9a3b952f999f.mp3";
export const HorseM1Tam = "07aeefe0-483d-476b-8e36-f4bc1c292791.mp3";
export const MugM1Tam = "82c9a394-b7fd-47bd-b7a7-5f81cd74bda9.mp3";
export const CarrotM1Tam = "e700a991-bad9-4a21-bc67-3aece7938c67.mp3";
export const SquirrelM1Tam = "8fa6d507-9cdc-4ac3-9b17-85bb17997238.mp3";
export const PomegranateM1Tam = "9be5fdd3-b573-4d41-ba56-8e52f9b08e7a.mp3";
export const TREEM1Tam = "48e902f5-c63f-41ee-bb05-b99b76422850.mp3";
export const PeacockM1Tam = "3babad17-0c63-4de2-98a1-c39263a35375.mp3";
export const LotusM1Tam = "866174a4-8e56-4810-a1e3-0e132059661a.mp3";
export const SocksM1Tam = "db6ad99d-7bcf-43af-886a-07df7bc112a9.mp3";
export const SkyM1Tam = "80111429-928d-4a3b-ad64-1d695bc9636f.mp3";
export const timeM1Tam = "7407492f-2b13-4e67-b6bf-9ca6a9ac76da.mp3";
export const DoorM1Tam = "4de2d3ed-de51-4134-81eb-ef626c64c7c3.mp3";
export const WheatM1Tam = "61abb5e0-59af-4e41-8a8d-27b72472a1f1.mp3";
export const WolfM1Tam = "455a5577-2888-4f5b-b5b0-27dd8d249ba8.mp3";
export const angerM1Tam = "e083a04f-af0b-4d14-9c53-84826a9a0221.mp3";
export const RABBITM1Tam = "9011c035-a11e-4ca8-865d-8d2dbf6926e2.mp3";
export const CrocodileM1Tam = "e86936f9-2ddc-427f-810a-6f9d6c0130ab.mp3";
export const FingerM1Tam = "4b631e8f-f3ee-423a-8780-63e131bc8a50.mp3";
export const NailM1Tam = "45d7a636-1041-4ac0-a30c-f22c130f6310.mp3";
export const SareeM1Tam = "690e7e85-6a7a-4192-a578-22f96a43c393.mp3";
export const LampM1Tam = "d357755e-4d5e-49d5-af8b-a2a1e63b8d2d.mp3";
export const TeaM1Tam = "265b3e3f-78a9-4b93-9ecc-1ef921336b95.mp3";
export const FluteM1Tam = "16e18fcf-4d30-493c-b9bf-90bf6c7d831a.mp3";
export const wingM1Tam = "7d63f3c8-93ed-440c-ab12-70f80372786b.mp3";
export const STRONGM1Tam = "1e0c81c0-6b73-42e3-bf6a-f47a8b8edb97.mp3";
export const shadowM1Tam = "01ce12a1-f605-4a5b-99ef-c9b56684ee29.mp3";
export const rangoliM1Tam = "2aa048c4-47e4-4eeb-9389-fc15fde41f8c.mp3";
export const CurdM1Tam = "fa4a485f-a409-49cd-bdcf-3d562b8ac385.mp3";
export const CloudM1Tam = "f816c92b-1727-4175-9228-d5cee2108575.mp3";
export const hutM1Tam = "23a1a9ad-76d6-4fe5-b8fe-2ad0678ebd18.mp3";
export const necklaceM1Tam = "1c0333b7-b860-4f79-922a-02b1142a0c3a.mp3";
export const AxeM1Tam = "5f8c54a4-e714-4a24-998a-6691674b36e5.mp3";
export const RupeesM1Tam = "e8a0c8db-e779-4d26-9e0c-78395f50f5e0.mp3";
export const thirstM1Tam = "a1160762-6e6f-42f6-893b-acf600609591.mp3";
export const MONTHM1Tam = "1a8fce01-04c9-4bdf-98f6-4b132a79e0ad.mp3";
export const TapM1Tam = "d5ff1195-b9eb-40b4-ac05-6d2c78600d3e.mp3";
export const oceanM1Tam = "5dc390e9-5b60-4df5-81d7-19b452a465b1.mp3";
export const FaceM1Tam = "7ceb29a4-e7b0-473f-bc52-2a97b5d475a1.mp3";
export const stormM1Tam = "7d7a50de-0325-44d7-a2cf-9936b441b5e7.mp3";
export const BuffaloM1Tam = "56f7e660-942a-43df-be89-32f207395b42.mp3";
export const MintM1Tam = "a8e48b2c-48e5-494e-a51a-69b6daaef01b.mp3";
export const bridgeM1Tam = "8998715e-7dfd-4ade-a3bf-318b1613530a.mp3";

export const plateM2Tam = "cfa64d7d-c8c6-4f80-8800-ac0f7c0c9258.mp3";
export const toungeM2Tam = "d61b8fbe-e6fa-446b-9384-9025e938a451.mp3";
export const noseM2Tam = "089c86cc-e684-47f2-84c7-0d4717db81a2.mp3";
export const saltM2Tam = "1d8f4912-da95-405a-9d72-07ec42f34c80.mp3";
export const jamunM2Tam = "e9a9cc37-a50e-4795-866c-b3842f215c75.mp3";
export const eggM2Tam = "c6170deb-d7dd-47a2-8d44-206f2de73cbf.mp3";
export const chapathiM2Tam = "72d3fab6-262e-4c7b-9e6e-c6bf8942da7d.mp3";
export const knifeM2Tam = "ab968510-524a-425a-b0fe-e76fe472a663.mp3";
export const shirtM2Tam = "64a1a32b-5c49-476a-adfe-5bad2edd4976.mp3";
export const chairM2Tam = "80435c72-1743-4529-a6e1-0c388ec6a929.mp3";
export const threeM2Tam = "53c4030f-526a-4163-92e6-4f061fd92995.mp3";
export const snakeM2Tam = "0008afca-96ac-4e67-9c12-4f89b8a27c87.mp3";
export const crabM2Tam = "f61ad050-640d-4b4e-8d70-357041edb33f.mp3";
export const coconutM2Tam = "5fc3b861-21f3-4301-b2aa-120d92716595.mp3";
export const owlM2Tam = "53ed230d-930c-4f6d-9bbf-5d2839aa5d53.mp3";
export const busM2Tam = "fa6abcd4-43cb-4015-9df5-0a023dbc9434.mp3";
export const toyM2Tam = "400c582a-b10d-4ce7-a5ef-57443550bca5.mp3";
export const goatM2Tam = "368c3b3f-f84b-4f22-9cec-c018f1757a72.mp3";
export const combM2Tam = "33e850e2-9b44-466a-9341-9943a4196d26.mp3";
export const chappalM2Tam = "9ed75908-89cf-4029-8bb8-0b4ec8dd002c.mp3";
export const capM2Tam = "c3dbd5ea-53d1-4ac5-b6b2-14391b0cd3aa.mp3";
export const lizardM2Tam = "c513bc1a-7a93-477a-9d19-e5e0bacbef2d.mp3";
export const garlicM2Tam = "521098b7-358e-4d46-9046-529c5464b68c.mp3";
export const boxM2Tam = "b3da53cb-0794-48ed-b2b3-7b64550ae899.mp3";
export const blanketM2Tam = "b9ef916d-4c74-4baf-bf19-85ef4c68cad7.mp3";
export const cauliflowerM2Tam = "c8402255-5834-4cab-9fe5-3da02b8cdbe3.mp3";
export const fireM2Tam = "ebf95523-1e6a-4bda-9116-245c6cfd92b2.mp3";
export const kurtaM2Tam = "0b066d22-e155-424e-ba0f-ebeeb78a4f97.mp3";
export const foreheadM2Tam = "18a728f1-8baf-4ea7-ab14-ed786f522f59.mp3";
export const ballM2Tam = "b8a5c125-4a07-4f1d-b194-21a38fc24c75.mp3";
export const lockM2Tam = "9d2ad43e-6ac2-49d7-9321-10bf2a7ee13a.mp3";
export const stickM2Tam = "a9cfbc3c-60fc-4814-88b8-98c40d4bd67b.mp3";
export const craneM2Tam = "2c576d02-4f29-42b2-a6ca-7b368fb6c0ca.mp3";
export const butterM2Tam = "8c94989d-1949-48c8-a770-f1ce8fab8906.mp3";
export const cycleM2Tam = "19cd3fd3-8ba0-4adb-bc04-a6478b06867e.mp3";
export const bottleM2Tam = "707837ec-2ff2-4bca-a325-2f832c8886e9.mp3";
export const sweetsM2Tam = "abbea641-4020-48fa-8712-5895bfdb08c0.mp3";
export const kiteM2Tam = "e64770a1-ef07-4bb5-88cb-64f528912a1e.mp3";
export const neemM2Tam = "71c59e50-207f-4322-815e-0ab3fa16f4d1.mp3";
export const castleM2Tam = "eed6ae75-9bd4-4448-bc08-222e3c8f0166.mp3";
export const bearM2Tam = "0e1da3d4-6001-49e9-ac69-14ae28682b84.mp3";
export const nurseM2Tam = "c5b45b56-eb35-4bfb-a19d-0dc941925b31.mp3";
export const ladduM2Tam = "3585e02e-9d02-42c3-908b-e08d192decd6.mp3";
export const songM2Tam = "ce83e47f-51f8-43f3-8dcd-f33727e3aba0.mp3";

//export const lotusM1Kan = "3afb6062-6a46-4e50-b935-c75e0690aec7.mp3";
//export const spoonM1Kan = "6b43f304-017e-4b76-9733-1d93d6c5128a.mp3";
export const bearM1Kan = "cedc0ca0-d9ab-4b7d-aeb5-352641bd0dd6.mp3";
export const shipM1Kan = "4f5d8904-f78d-4a23-8b17-cb5ca67b87ec.mp3";
export const tabalaM1Kan = "013997cf-d98b-4297-b0d5-7ab88382e2eb.mp3";
export const singerM1Kan = "61b67250-6c51-49bb-b6ad-1d0670f1b4be.mp3";
export const dhobiM1Kan = "69897af4-9072-4291-b2a0-4f1f097938c7.mp3";
export const kingM1Kan = "6ff8cd85-b2ac-4042-9d12-463e5efe6c43.mp3";
export const mathematicsM1Kan = "bbb9faa2-9ddc-439f-b4ad-36a518858a62.mp3";
export const jackfruitM1Kan = "ab1b8642-b3fa-4271-9ba6-5ca6f9bc61e9.mp3";
export const boyM1Kan = "1fedcc8f-6c95-47f4-989c-cab60e53df53.mp3";
export const peasM1Kan = "0717fd43-e7af-4907-9b82-14aca7cf6fb4.mp3";
export const fishM1Kan = "15b3ecda-287b-4737-b66d-362d8fd1baac.mp3";
export const lemonM1Kan = "2311893f-812b-437d-873a-6de9594cc03e.mp3";
export const familyM1Kan = "d62fbd9a-146b-4753-8528-b231b88dcfc4.mp3";
export const humanM1Kan = "7655c12c-56ff-4da9-92d9-483af66cdee0.mp3";
export const vehicleM1Kan = "c4ed50eb-7ae6-43b4-999c-04108f014a8d.mp3";
export const cabbageM1Kan = "e9dff413-c8e2-431a-aab6-9d65dddbebb9.mp3";
export const earthM1Kan = "6030a754-ed78-4dc7-86d7-44557d116509.mp3";
export const coffeeM1Kan = "346264dd-ef02-44f3-93e9-4773bf4037cf.mp3";
export const gingerM1Kan = "121a1460-d53e-493e-b528-00f715dcdbe8.mp3";
export const goatM1Kan = "336c01e7-b826-42aa-b142-8f827f5d4ccd.mp3";
export const dosaM1Kan = "487c72ce-6b3c-40b1-a777-99ac1b5d6471.mp3";
export const deerM1Kan = "0c56a8fb-1995-4457-9773-6d5f4d94d65c.mp3";
export const tableM1Kan = "6657fad5-d32d-4fbe-9faf-294e3f760cee.mp3";
export const castleM1Kan = "2a0a9024-6af8-4ac6-9ff6-d3a925332221.mp3";
export const peanutM1Kan = "5aa6dc29-1653-4be5-b0a2-189f5d11baea.mp3";
export const shoeM1Kan = "c9fe57b6-64ed-4573-ad80-bc7c5332f9b4.mp3";
export const neemM1Kan = "7113239e-6f80-4b67-abe6-f8f51a8e1f1c.mp3";
export const owlM1Kan = "d385867d-42d4-4a49-83c2-af37c7de8917.mp3";
export const cucumberM1Kan = "2d7f44a9-f823-4755-a2e7-3c9f0ef406e4.mp3";
export const moustacheM1Kan = "e2c82699-c660-4fe2-9d03-d868d6d9ef00.mp3";
export const festivalM1Kan = "1a42ed7f-3241-4cf8-8daf-c82252964655.mp3";
export const ladduM1Kan = "8534576a-1c38-4d14-8c0c-12bdb261fff2.mp3";
export const eagleM1Kan = "82d9c04c-acb1-4094-a46d-0f3640cfa5b4.mp3";
export const birdM1Kan = "46c503af-2085-4b3a-9486-14da4e4ac0f5.mp3";
export const sparrowM1Kan = "cd2dec9f-c65e-4111-919a-455db042c853.mp3";
export const fruitM1Kan = "fa9f2e85-201d-4dd5-9f87-8fa451e38fe3.mp3";
export const limeM1Kan = "36040ec5-9f63-4e69-a393-b5e80fb82e56.mp3";
export const basketM1Kan = "5a6725ce-94c1-492e-9f61-559b51787f10.mp3";
export const sareeM1Kan = "683870f5-383b-47d4-8f53-670b4ce8f668.mp3";
export const guavaM1Kan = "33032461-184c-405f-a234-d44c20936764.mp3";
export const wheatM1Kan = "67626517-6ccb-4259-9575-658120ab9dde.mp3";
//export const umbrellaM1Kan = "7a8cf3c0-feac-44ec-ac27-2b5e2fc0aecd.mp3";
export const foodM1Kan = "a7c86135-65aa-437c-a193-9820dfbb98b1.mp3";
export const skyM1Kan = "7fb56edb-3078-4898-b33d-8a740f2c83c5.mp3";
export const teethM1Kan = "85284c4a-757e-417d-b0d7-fc30554ef681.mp3";
//export const angerM1Kan = "c0a464f2-9b50-453e-90f2-7f4f0d203282.mp3";
export const frogM1Kan = "4a5b1379-cba3-473e-985c-fb0bef2d1009.mp3";
export const saltM1Kan = "b312ae1f-2f28-41f6-ae75-59ea2bfefa77.mp3";

export const clockM2Kan = "0c8a47db-a085-4bfa-b0bc-ac85b5a27d44.mp3";
export const vegetableM2Kan = "9f259c91-12d8-4323-8d0e-5e54e99cccce.mp3";
export const winterM2Kan = "91ae0575-8b79-49f7-a450-555590c6ff40.mp3";
export const kiteM2Kan = "88a97989-082b-4e6c-8d85-942a88d04ad7.mp3";
export const hutM2Kan = "dd0e86a8-ba76-47e9-8799-fb9c5aa0e78c.mp3";
export const necklaceM2Kan = "ecdd10d4-2b1f-4a2f-9653-2ed9f38a92d8.mp3";
export const hibiscusM2Kan = "d5960011-9b42-4f9f-bea9-74619411712a.mp3";
export const pigeonM2Kan = "48d79fda-8197-4f5d-a7fc-c98a1813fd10.mp3";
export const pineappleM2Kan = "3a4b9285-205e-4073-87a4-232343df8bb0.mp3";
export const sweetsM2Kan = "5cd430b3-1af1-44e4-b14c-b450e01b4344.mp3";
export const scissorsM2Kan = "cfda2652-9deb-402a-a844-ede077a21233.mp3";
export const donkeyM2Kan = "1d4f466b-94db-4a1b-9787-58371355f454.mp3";
export const onionM2Kan = "716311b9-5836-402c-b9d3-9a710016b851.mp3";
export const papayaM2Kan = "de367ff4-cf78-4e87-9a84-2ac3954999e9.mp3";
export const woolM2Kan = "9ba34c0f-34e5-48b0-aa48-0d1241bf87d5.mp3";
//export const chocolateM2Kan = "bf0a9957-2258-4bb6-8184-af39c1d65de7.mp3";
export const butterflyM2Kan = "8f9ad22f-9b57-4e2e-9660-b0e869baa1c6.mp3";
//export const rotiM2Kan = "c5a797ff-18e4-40b7-8a0b-5fa4dfea00b3.mp3";
export const catM2Kan = "55fc8479-45d1-4fed-acc8-f79f77335e7d.mp3";
export const duckM2Kan = "3f7452cb-4835-4da4-98dd-a5b5028d1fd8.mp3";
export const woodM2Kan = "357b4024-951f-4403-8ff6-f322f33c0d15.mp3";
export const butterM2Kan = "7b07c982-1333-4976-8d3a-7ac690501ecb.mp3";
export const eggM2Kan = "1468d3ef-9103-4d05-8859-8068b59c2547.mp3";
export const mosquitoM2Kan = "f5f3f98b-f69b-40c3-8efa-a7ed6bbd928d.mp3";
export const watermelonM2Kan = "1e2d9473-1346-40b5-9220-2f92daae7b6d.mp3";
export const jasmineM2Kan = "c5e3c0d2-3abf-4682-a65e-9e4fb1c16f88.mp3";
export const cycleM2Kan = "1a82b6ef-5e02-488e-a272-9ec8a23cf995.mp3";
export const doctorM2Kan = "9c4d4d23-1595-4269-9e48-cbec33bc78d8.mp3";
export const hammerM2Kan = "852316be-5e34-4b5e-a941-11a8bc165219.mp3";
export const bananaM2Kan = "bbd0be11-74c3-444f-8184-7b3f852a6a0a.mp3";
export const mountainM2Kan = "9df9c89f-134d-41e7-b113-a89419ab859c.mp3";
export const danceM2Kan = "d6b922c5-7763-44a9-a383-f64d2de3a4da.mp3";
export const manM2Kan = "a8b96946-ba5f-467d-b1e2-4a0caade9a3d.mp3";
export const barberM2Kan = "da6a8934-1c07-4808-97d7-d8f8abef930f.mp3";
export const zebraM2Kan = "18a0b953-81e4-4e03-9cf6-6dbd9338220c.mp3";
export const scooterM2Kan = "e323e4ef-8af0-4bbd-ba70-bdc0c7086f7c.mp3";
export const bookM2Kan = "93374d9f-5461-4c24-b33e-c19213bf683c.mp3";
export const muscleM2Kan = "11abe543-cabb-47f1-904f-24180ab876c1.mp3";
export const teacherM2Kan = "215f6877-c39a-41dc-bed5-cb434bfa7ace.mp3";
export const animalM2Kan = "44031ffd-1eeb-41c9-ba4f-2e8dec8b78e1.mp3";
export const chairM2Kan = "b8fa518d-6a31-4306-aac0-bb6811db787c.mp3";
export const scientistM2Kan = "a8907195-6ef2-4a5c-989e-2514f50132b7.mp3";
export const watchM2Kan = "f22552d6-f85b-4562-9f67-f65e56c612e4.mp3";
export const carrotM2Kan = "6fc73288-02b9-4419-b186-1d96ecce176c.mp3";
export const garlicM2Kan = "8ef481e3-d9be-41a9-8a76-40b7eb81faf9.mp3";
export const sunM2Kan = "659175bd-59ea-431a-915f-5986759ea6ec.mp3";
export const brotherM2Kan = "483134bf-08e3-496c-8bb9-0bda719fa39b.mp3";
export const prizeM2Kan = "cfb42fc8-f694-49cf-a204-1fac180c4003.mp3";
export const almirahM2Kan = "bcfa235d-804e-4eef-9cfd-cc112ac1ce22.mp3";
export const rawbananaM2Kan = "f8790636-5595-44f8-b40d-9185a13e06d0.mp3";

export const musicM2 = "64c8eac8-592b-41db-9fea-1a8ca9ec29c4.png";
export const utensilsM2 = "ff6b3b54-43b1-4393-b6e5-bcf96ee47fc6.png";
export const dragonflyM2 = "a21e88ed-14a3-414a-a7f4-a9479cbc5598.png";
export const textbookM2 = "d77dd2e2-5cf1-459e-a523-6e1623d0bfad.png";
export const monumentM2 = "4a4813c7-fe58-4bfe-b659-4477e8697de3.png";
export const chairM2 = "8a779c01-e311-4031-8c6d-8f55cba17c43.png";
export const chocolatesM2 = "4b9d1b02-8126-45b0-be6e-36af966c8b85.png";
export const branchM2 = "22c858dc-f59f-4718-beed-e774612a057a.png";
export const beachM2 = "11eea642-0b83-4a9c-acbc-e48d687b60ec.png";
export const mouthM2 = "acaf16fd-23ba-4862-b63f-460980549745.png";
export const cloudsM2 = "0ab16d6b-74dc-4dc6-a5c1-75f41f98adca.png";
export const thinkingM2 = "d247f5b9-9905-4646-8bd4-a4d822c9329b.png";
export const teacherM2 = "61fab058-db6f-4509-8773-6e1522330c63.png";
export const mouseM2 = "1283717f-329b-48bf-8700-6257256fd2da.png";
export const stichM2 = "fdfe3d60-7f00-4202-b2f6-9057a29d3277.png";
export const brothersM2 = "bf8043af-34df-43fd-93ce-6f7bd9239a56.png";
export const goodbyeM2 = "1b913f23-60e6-42cf-b1d5-5a54a8b4f12e.png";
export const clownM2 = "7059fd0c-615b-4a70-8858-7a8bf51f85c4.png";
export const handkerchiefM2 = "ad99bff8-100b-4dc7-b66f-4ded9ba56875.png";
export const aeroplaneM2 = "4979f23d-92ea-4638-8a9d-b9c8472dd6e9.png";
export const kitchenM2 = "da5366e7-d0b0-4871-a2d2-f1bed46927c9.png";
export const jackfruitM2 = "a2667eb0-9fdd-4fa6-9be1-47a2c59061a9.png";
export const teethM2 = "9a750e96-06ee-4b3b-9608-6043bfb78b74.png";
export const notebookM2 = "6e8720e3-02b3-4ead-b3be-495e79776061.png";
export const joyfulM2 = "1bda7bdf-1696-42e5-b0d2-13bfb403dc21.png";
export const flowersM2 = "549977b5-fead-4973-8f06-51636a0da257.png";
export const curiousM2 = "ad404dae-b9a3-4510-94d6-61d7122cee63.png";
export const sandcastleM2 = "141f1ceb-096d-4792-8132-88458aac5f36.png";
export const earthM2 = "af1aac98-4015-4a9a-99d1-8878d32a3452.png";
export const drawingM2 = "34fb65d2-02d7-4dcb-bc89-9a9d5bc4f7fb.png";
export const womenM2 = "1632e900-9ca7-463b-9495-afda3c4f6af6.png";
export const warriorsM2 = "d75e3270-1923-4c3a-86a5-20baa937def1.png";
export const footpathM2 = "00288ff4-817e-4ca6-8152-ee8ddae2ec86.png";
export const oilM2 = "ebded0f6-72ef-46c7-8fa7-a2e650a8b8ef.png";
export const mountainsM2 = "aa1f7b17-4238-4775-948f-403c3333e1e6.png";
export const sugarM2 = "8372cfad-0877-43ff-8cd7-6984338a94bb.png";
export const lunchM2 = "806e8cc2-40d3-4777-bd01-a60b39c7dafc.png";
export const championM2 = "c3b96dd8-b579-46c6-b2bf-4e9bd931b2b2.png";
export const bookM2 = "693dff89-f305-431b-9e82-554c6290a165.png";
export const grandfatherM2 = "15df4eb1-99a5-486a-b659-c2596bdd2ffc.png";
export const houseM2 = "39f93d76-074a-4f3e-b102-237bd737c97d.png";
export const sproutM2 = "f140a48e-59e4-4788-882d-d9a59a6856cd.png";
export const soundM2 = "8eba7cee-4519-4aff-8d90-ad71015ee4e0.png";
export const mathematicsM2 = "2cfc23f7-d711-4b55-86b3-24a7e9e294a7.png";
export const cheerM2 = "cf30e665-0d5e-4c05-880f-fec32682db46.png";
export const lecturerM2 = "ceb80c7e-dc7c-47f4-a1af-ed99208b9fec.png";
export const clothM2 = "2ff40487-6c5f-4275-8d7b-7d34bc62c902.png";
export const cookingM2 = "2c2f1937-0408-4a93-854e-8fea73ccbac1.png";
export const woollenM2 = "e3c34987-d70a-471b-8bbf-08e41e224284.png";
export const cherryM2 = "7f3a3cf0-0751-4d95-98d2-a06b4076e53f.png";

export const mobileM2 = "d8799cfb-9bde-4dd0-ad50-c6ffcea74996.png";
export const bandhagobiM2Hin = "4642dea7-069e-4e6a-904e-2c3ef51ec0c0.png";
export const mirchM2 = "e0f83204-bdb9-4a5b-97c0-8d727d308635.png";
export const masjidM2 = "74a50c77-a544-4761-a2a1-005368ab91d1.png";
export const mumfaliM2Hin = "5549c4ac-83f8-477f-84da-01c0b56ce2b9.png";
export const maccharM2Hin = "be25a3b3-2732-4401-bba5-6c3e534f7bfc.png";
export const doctorM2 = "a4af8885-846a-4940-865b-4589543f37fb.png";
export const khelkudM2 = "b81d85e1-81a6-4000-9c5b-0b2d5214308d.png";
export const pushpM2Hin = "6424033c-5bc3-44af-bcd2-ada2e2259a72.png";
export const scooterM2 = "662d6e8b-8328-49d0-9677-6367b0c22600.png";
export const circusM2 = "19a0a9c3-5514-4d62-a010-9cae0743b27c.png";
export const helmetM2 = "612abaf8-c1bd-4b30-834d-03f124ffa299.png";
export const gubbaraM2 = "c8ca8547-338b-40d1-88b5-a5cdcaa20210.png";
export const krishnM2 = "208da779-e458-467a-b69d-df620f913939.png";
export const basketM2 = "5460df24-8c10-4e37-90a3-a1f135b5d656.png";

export const threeM2TamImg = "7d83081b-c8b5-4ada-9794-6e5adf3f0d9b.png";
export const capM2TamImg = "1d7242bc-a2b0-4686-a5d2-3c0fda4d200b.png";
export const combM2TamImg = "713ee6c3-db71-46dc-a81d-a90614024189.png";
export const busM2TamImg = "b960bb84-63c6-48ec-ae36-b224295996ab.png";
export const shirtM2TamImg = "2d34e4bb-e88e-4522-8feb-3863e916c5d7.png";
export const saltM2TamImg = "c5d729a0-85e5-4c3e-90ff-d86ede54a16b.png";
export const chairM2TamImg = "52e0380a-2d09-4654-8592-1ab8a6f2ac7a.png";
export const chapatiM2TamImg = "0fd4315c-65f9-4120-a68c-a5d75995c454.png";
export const jamunM2TamImg = "e40165ff-6e0e-4081-8136-269d85af1535.png";
export const goatM2TamImg = "0eb2f6f8-1fc3-4ce1-b64b-137c75b763b2.png";
export const eggM2TamImg = "c346b4bd-3dc2-4f39-bb04-f48fa82d1067.png";
export const snakeM2TamImg = "c2fe59c1-ca54-4113-9fb9-eb5fff7247eb.png";
export const crabM2TamImg = "69ebed8e-445f-4d00-968f-348d712bf7da.png";
export const knifeM2TamImg = "da501f4d-9bce-4bc5-b636-9e4d92b19e85.png";
export const toungeM2TamImg = "e287b028-eabb-4a83-b96d-293aa90db034.png";
export const toyM2TamImg = "5ff5da83-6d45-4262-9511-a31a48cf842e.png";
export const chappalM2TamImg = "f005cf57-96d4-4975-bb46-3100b99402fa.png";
export const owlM2TamImg = "edc8e66a-9fd1-41b2-b056-83ce961e9ae4.png";
export const noseM2TamImg = "ccb1c596-9961-41d1-b7a0-74aa16ffafff.png";
export const plateM2TamImg = "a1fb35e0-4456-4d6d-921d-b407957b5889.png";

export const duckM2KanI = "abf67bb2-3e2e-45b7-af16-379d3dbdae7a.png";
export const hibiscusM2KanI = "c1b25b55-c152-4a5c-bb87-ffd196c0fb5e.png";
export const necklaceM2KanI = "87d440ff-2cb6-4a56-a62a-9053b447ccd2.png";
export const pigeonM2KanI = "2f988989-207a-4acf-83ba-843921a1fe91.png";
export const clockM2KanI = "5adee007-622c-43b1-85ed-4e4b3945ec86.png";
export const butterflyM2KanI = "57f9e497-aba4-4ff1-99ac-e03c7f463faf.png";
export const chocolateM2KanI = "349f01cc-e971-4314-8361-c22f7a59f483.png";
export const kiteM2KanI = "30eb72f5-86f7-476f-9069-5b0b88541b7c.png";
export const hutM2KanI = "4857d2f9-94d1-4434-9753-232ee20fc30f.png";
export const woolM2KanI = "95e4f6d2-8773-4faf-bfeb-2c12a61a3d20.png";
export const sweetsM2KanI = "fdcb537f-1773-4240-b623-a300f649aace.png";
export const winterM2KanI = "265a55f9-06d8-4879-85b8-9fa87cbe2dcf.png";
export const pineappleM2KanI = "54efaa1f-64f4-4428-92c1-4720f97a6dbc.png";
export const papayaM2KanI = "fe3186b6-8fad-4b55-b2b8-af8bd325501a.png";
export const vegetableM2KanI = "320abdf5-4597-49e7-bd7f-b672bd4856d5.png";
export const rotiM2KanI = "536fb8e4-f899-4b3b-82b3-bb06a7c4f1a9.png";
export const scissorsM2KanI = "67d40819-e8c7-4a28-87d4-831505ce5114.png";
export const donkeyM2KanI = "52e8bdd6-803a-4966-91f9-019c0638c86f.png";
export const onionM2KanI = "83453e5c-b7c2-4986-97c6-82c8229054c0.png";
export const catM2KanI = "f2c3a920-fad4-42de-959d-d1601c21fe62.png";

export const cucumberM2TelI = "987d5c3a-930d-4dc5-bf00-fd72cc09a459.png";
export const pickleM2TelI = "3a3207a2-e8f8-4eab-9203-894ed33bd9a4.png";
export const winterM2TelI = "d6fdeb11-6966-4bcb-b75a-f5538e4ef35c.png";
export const peasM2TelI = "d3c7ebbd-021f-49b3-9dac-16ca9f299d6a.png";
export const teethM2TelI = "381f2f1c-ce60-4ae5-a5c5-9faa75958ed1.png";
export const noseM2TelI = "1c45986c-e18e-4c67-be8d-ba610a466e62.png";
export const eyebrowM2TelI = "d20e78d9-4a77-4596-aecb-dccde6667410.png";
export const eyeM2TelI = "f95ab407-ca4f-4a79-a445-6e057321e7bc.png";
export const treeM2TelI = "1d362b1a-ecab-4bb4-a903-1b0278cc1093.png";
export const humanM2TelI = "f390a5c3-7a74-4b8f-a8ba-4030afa6983a.png";
export const keyM2TelI = "b1a91d62-29c7-4cc4-9ec8-48e1f9c5c8e2.png";
export const soldierM2TelI = "2eafe8ec-6890-40e6-8341-c85e2e910eeb.png";
export const spinachM2TelI = "93761217-75a8-4204-94f1-7c9312e62732.png";
export const watchM2TelI = "a76b4ea9-184c-41e9-972c-5bea67e7901e.png";
export const authorM2TelI = "764c50c7-1d74-45b8-b7cd-0fd8021adb3b.png";
export const shirtM2TelI = "d86beef1-5808-4894-95f4-19fb238f5bb8.png";
export const honeybeeM2TelI = "ffb1bb71-d68c-41db-82e4-52ad42a69e1f.png";
export const hairM2TelI = "3555e8ed-a3a8-4a15-98a4-c13346919126.png";
export const kiteM2TelI = "40053019-a603-4601-927f-e27bd8bd7b62.png";
export const rangoliM2TelI = "55b1bd48-e425-4198-bd13-6e8085530d29.png";

export const authorM2Tel = "0e42f88e-1f99-411d-9f4f-1fb1ea8393d2.mp3";
export const kiteM2Tel = "c4643035-14d8-4f9a-afc7-7356ef899b1a.mp3";
export const winterM2Tel = "cedf0903-a16f-4dfc-9038-99298701203f.mp3";
export const pickleM2Tel = "0bd428a6-49b7-4e8f-ae99-acef075350dd.mp3";
export const watchM2Tel = "3ba89d22-17c5-4034-9272-9a3b1c3f05b7.mp3";
export const spinachM2Tel = "4b92420f-0034-497e-b5cf-7f6789d3c0ba.mp3";
export const peasM2Tel = "a2c2db2f-3fe0-46fc-8897-8dee417aa2d6.mp3";
export const eyebrowM2Tel = "743f55e8-11af-41d0-b4cd-1592722d074f.mp3";
export const cucumberM2Tel = "4e48e013-da76-46d7-88bf-0736e942d319.mp3";
export const humanM2Tel = "6deeb3d1-d27f-478b-9652-76f72e836b3a.mp3";
export const soldierM2Tel = "f700e758-3680-4365-9b20-ed54bdd6b9bb.mp3";
export const keyM2Tel = "4a1131d2-b80f-4077-981e-e1a6dea198cc.mp3";
export const rangoliM2Tel = "63ff33d7-a539-4f94-8c9a-d86e7fc75524.mp3";
export const eyeM2Tel = "9ee1a090-d543-4fb9-8467-bdcba11a1095.mp3";
export const hairM2Tel = "8d13ccb8-9542-4d26-a4b0-37c7254f8128.mp3";
export const treeM2Tel = "4ccccfd3-5a20-4d22-9baa-93fc3faeb67f.mp3";
export const honeybeeM2Tel = "ca3bc186-4f18-4144-b697-6ca628a9eda2.mp3";
export const teethM2Tel = "68e5bf20-cd43-4e1d-98c4-2afb5f0c768f.mp3";
export const noseM2Tel = "bebc1c9a-d5c0-4df3-a1a3-936b55b75401.mp3";
export const shirtM2Tel = "7dc050a3-c11d-49b9-b5ab-3aed381ca34c.mp3";
export const catM2Tel = "81b30e91-b36c-4923-bc60-6af36386d6b9.mp3";
export const axeM2Tel = "a6560157-d006-473c-bc36-66e6070a534f.mp3";
export const figM2Tel = "d16fdc1a-0b2f-4254-8328-eb01dacd79e8.mp3";
export const coconutM2Tel = "498e7710-8323-4601-82de-ccb5aa740650.mp3";
export const limeM2Tel = "8aa221d9-de98-4859-8263-472b1c94a44d.mp3";
export const hammerM2Tel = "7bf7d8a9-6479-4346-9fef-56a7a753154b.mp3";
export const cockroachM2Tel = "2a062aa3-d949-478b-960b-ad06bb96a319.mp3";
export const skullM2Tel = "c916d9db-0ecd-457c-baa0-2e40fae7c546.mp3";
export const batM2Tel = "ba367898-1099-4ef0-b67c-7343a21a189a.mp3";
export const birdM2Tel = "5a842888-7df0-487c-a4eb-25b41b1332e3.mp3";
export const papayaM2Tel = "cecb6334-3026-46fe-8dfb-b0d2842ab6ee.mp3";
export const potterM2Tel = "a11d3dc9-7fd4-4124-abcf-caa81b09adbb.mp3";
export const chocolateM2Tel = "ac60799f-8712-4e1c-9fe0-5fda95616ba4.mp3";
export const onionM2Tel = "02e50d6d-a5c7-4dc9-8fb8-a37caf9c898b.mp3";
export const zebraM2Tel = "d5a4f722-76fe-4ab3-bd2f-8df35242ca0b.mp3";
export const pomegranateM2Tel = "255b91b1-9270-42d6-b379-6a590b170096.mp3";
export const shopM2Tel = "d3f653e1-b946-4b46-89e5-9b5beaeaec85.mp3";
export const painM2Tel = "bae38409-4d5c-435d-ad75-0c2e628bd281.mp3";
export const riceM2Tel = "6db5d640-fd4d-4c94-b14c-a8d431439e97.mp3";
export const combM2Tel = "02ac0450-6e1e-4b5d-b37d-dd29c1f844d3.mp3";
export const cuminjeeraM2Tel = "070da9fb-15a1-4a68-a52e-afdd898317eb.mp3";
export const swingM2Tel = "2810a0d1-497c-439e-a43e-1b348c2a15cd.mp3";
export const sheepM2Tel = "b2f5a48e-771c-4183-8df8-d93fa4cbbe65.mp3";
export const vesselM2Tel = "7092878d-3007-4c2a-a78b-b8556e6cd1dc.mp3";
export const scissorsM2Tel = "45f01d3c-7dd4-4ffa-852f-8ef270097bf6.mp3";
export const boyM2Tel = "32f54861-59a0-4cfc-82b5-f87d484dffa6.mp3";
export const jasmineM2Tel = "ef600108-d7b7-49a1-8a1b-acac217e554c.mp3";
export const swordM2Tel = "f8f605f4-525f-4563-8f52-0d3bb7bbb150.mp3";
export const boxM2Tel = "9ac9d28b-40d9-496b-8190-ebc4702b2800.mp3";
export const butterM2Tel = "6078fa9e-0291-4088-ae26-e6e1e10f56bb.mp3";

export const peacockM1 = "45af6441-33e2-4ba4-9846-aa483b18fc42.png";
export const spiderM1 = "b6f5fe61-1979-4da8-bb02-bc9b087b41c1.png";
export const appleM1 = "36474075-ca35-48d5-9fbb-91f052dab02e.png";
export const familyM1 = "110ade94-2ad0-43f3-a916-6440f633e338.png";
export const plantsM1 = "5d0bf26e-02b8-4930-832a-88b0a7da9bf7.png";
export const vegetablesM1 = "78b68b99-eec7-4179-90c5-a2fe95064913.png";
export const spoonM1 = "9911ad6b-e5c4-46fa-99d1-a5dbe97db3a0.png";
export const glassM1 = "f8732454-22ae-4df4-9fdb-6af6c6e68036.png";
export const zebraM1 = "99cdded7-8484-453c-a290-c54655b2a396.png";
export const clockM1 = "5aceb92c-eac3-4e6d-94da-0fb950394b69.png";
export const grapesM1 = "8c9d5d97-082f-433a-9552-d4b551208d55.png";
export const monkeyM1 = "76fd5a14-d9c1-46f2-a627-f0a81bb6d992.png";
export const tigerM1 = "82b86c0e-bc9a-4277-87e9-b7845b319fa5.png";
export const horseM1 = "59e34b82-db3f-43ca-aac4-d23abf12c303.png";
export const puzzleM1 = "d9cca661-3f75-4f3f-843d-29c66c7dc56a.png";
export const potatoM1 = "8615fdd0-77d9-4240-87d2-1ee60648ea79.png";
export const dustbinM1 = "bb6c881b-bb1f-48c6-9a39-78e1de88b068.png";
export const doctorM1 = "1d2e5bc4-ae2b-45e3-8792-88e1fef334b8.png";
export const happyM1 = "e6ed0e2a-9ca7-42f8-8187-4a2cfe939e08.png";
export const bananaM1 = "d863e5f9-eec2-436a-a325-387ab7c8e2b0.png";
export const numberM1 = "1083c5be-5a48-411f-8c70-d38fbb2e4c45.png";
export const pencilM1 = "e58792d4-3dbf-4741-ad8e-4c3f6b3aa214.png";
export const puppyM1 = "1490dc9f-818d-490e-90ef-5abf7c419b86.png";
export const animalsM1 = "b7e91a4a-0eb2-459a-af21-4c65060a4bc8.png";
export const tableM1 = "d66b78b4-d54f-46b1-8931-bfbfe849df49.png";
export const basketM1 = "a1f58546-f555-468c-967e-e40478065034.png";
export const coconutM1 = "75f34af3-1424-47ca-8b0f-aebdd8e22836.png";
export const turtleM1 = "2053bb2f-a7d8-4e8e-ac67-18cac5996442.png";
export const moneyM1 = "4dcb172c-b846-4cab-a4f0-77e50e472dd0.png";
export const phoneM1 = "83fac552-3f9a-4192-8ba0-2a9a48a3aad5.png";
export const keyM1 = "46e0b37a-1fb2-4b9e-b54c-10af524300bd.png";
export const windowM1 = "9b1cee19-1307-48e0-9312-37ab90195402.png";
export const kitesM1 = "67d7c188-cd01-45a6-9e49-32dc8e5744ef.png";
export const lionM1 = "f95617e7-13cd-4c2b-a772-a464112f7b14.png";
export const tongueM1 = "d74b5941-e6f7-4818-b0bd-957e897272a6.png";
export const balloonM1 = "94ba8064-2648-4c7b-805a-29ccd7acead4.png";
export const fruitsM1 = "411aa45b-e7dd-4cee-ad02-ef3b429b55d3.png";
export const cardsM1 = "a4f55144-9d1c-400e-b071-08ec5ea0a0f2.png";
export const mangoM1 = "5534c477-2246-4568-906a-32d1db9e239b.png";
export const elephantM1 = "57bf8b3a-ea97-4391-b9db-5e3efc70ff08.png";
export const cameraM1 = "428bb1f4-883c-4ede-a6b0-57fa05d47e49.png";
export const dragonM1 = "c9d1c0db-93b6-4994-9b0a-60a5891acebf.png";
export const stonesM1 = "f9a8f456-e692-4934-a775-041f0bbcfc83.png";
export const bicycleM1 = "ed506ed2-53c2-4986-a6b9-6efc521272ca.png";
export const wheelM1 = "c8b23b74-5039-47e5-adea-e73d5939be51.png";
export const orangeM1 = "1d3f3f0f-ee22-435b-b3a9-bca354cb7161.png";
export const handsM1 = "bebf3d92-d2fd-4950-b3df-96f6027aaf44.png";
export const sleepM1 = "2c09fee5-e815-4279-a9ed-738d60923672.png";
export const tomatoM1 = "20c862e9-a098-4040-a5a7-c562752829e8.png";
export const calendarM1 = "d2ce49e1-275b-4c24-9c31-70e293820963.png";

export const turM1Eng = "cb7656ee-e9da-4708-81b0-84b1dee12842.mp3";
export const tiM1Eng = "a6d379bb-1faf-4c7c-9ca6-4b2d80389e70.mp3";
export const cilM1Eng = "ed7b7ba6-28f0-436c-ad68-df90fda25c7e.mp3";
export const binM1Eng = "1eef7a04-673f-458d-9eda-8993ffdd26e1.mp3";
export const derM1Eng = "fb2cba27-e8e6-4a90-8d7d-84c4c06a983e.mp3";
export const angeM1Eng = "75cc150a-e8df-41a1-b8e3-7cd93e206625.mp3";
export const ketM1Eng = "5c6c3601-0170-4699-ab17-5a16b588faa2.mp3";
export const pupM1Eng = "9ec1d90e-0df9-4706-8dcc-490d464fde61.mp3";
export const puzM1Eng = "9381e935-c06f-4bd9-814f-874657d85740.mp3";
export const naM1Eng = "c170b4f8-daba-426c-99cd-8ffb1c2000c6.mp3";
export const orM1Eng = "052d6884-686f-45d8-8289-891a808ee6a3.mp3";
export const zleM1Eng = "18f891b2-1afb-4f3f-aa1b-179d97f2d4dd.mp3";
export const eyM1Eng = "44942599-d204-44da-ae24-e1aef3f56ce4.mp3";
export const apM1Eng = "aba19291-30e8-4d8c-af8b-80075ef4ec23.mp3";
export const pleM1Eng = "1504599e-1653-4002-8b50-7e4eac4083f7.mp3";
export const pyM1Eng = "bf6ee3b3-cf1d-440b-bba5-082feff67a1b.mp3";
export const balM1Eng = "923e0233-8e28-40d7-9e6b-b00116fc8e94.mp3";
export const baM1Eng = "eec95e5a-d626-4598-acb4-2122edacbcdb.mp3";
export const basM1Eng = "122fd87e-1ddb-43ff-9356-848e187948e9.mp3";
export const monM1Eng = "da76f1f7-b02f-4cf0-bdd3-0e05f84e2a17.mp3";
export const spiM1Eng = "7a42df44-3882-47fe-aa8e-9cceabac3bbb.mp3";
export const torM1Eng = "199f29cf-bb04-458a-a1b8-07efbb5a1116.mp3";
export const dustM1Eng = "35199934-5d30-4a65-a5cc-21e33f27bb17.mp3";
export const docM1Eng = "762329a1-33ef-4346-b970-7f55d2ab8c0b.mp3";
export const taM1Eng = "8dfe96da-4cde-4734-ae0e-f7da6ab7e6c2.mp3";
export const numM1Eng = "6df0b04b-0a3d-436f-a90d-37b109777b29.mp3";
export const dowM1Eng = "1a184f9e-3773-4efc-85a1-779415546846.mp3";
export const hapM1Eng = "b87ccf64-641d-4dd4-9ce4-c9911df0d72d.mp3";
export const darM1Eng = "cdd64441-9c26-47ee-ba98-40c651ec99be.mp3";
export const berM1Eng = "774a6bfb-d7d8-4b30-98f7-5682dc1cc4ea.mp3";
export const tleM1Eng = "8785a554-29b1-47ca-bac3-01a0ed5e7868.mp3";
export const enM1Eng = "5b57f081-a54f-4ccb-b6e2-a30ca62c97f4.mp3";
export const winM1Eng = "d96783bf-367a-45bb-a8af-ee129edebe24.mp3";
export const coM1Eng = "1015927a-1f2c-46f9-b388-9cb7b45b0655.mp3";
export const bleM1Eng = "7dfdfb3a-25e4-40c4-bb43-49b2d2aaca96.mp3";
export const gerM1Eng = "3aa8dd4a-4e75-4d90-9549-25ed316e5a3c.mp3";
export const penM1Eng = "e08f283a-4076-4a92-9657-bd824d86de0e.mp3";
export const nutM1Eng = "3128ea51-4ba9-419e-ba67-8d84a87c567f.mp3";
export const calM1Eng = "46b2d52e-54af-4e72-b6ea-94dffbf8e68c.mp3";
export const loonM1Eng = "aa20d377-d29b-4215-8df0-1364fd216c33.mp3";

export const damruM1Hin = "9051dc45-9e9b-47b1-80f6-7aaaff9768a0.png";
export const chawalM1Hin = "8b8f5051-9475-4bb8-bb6e-a8d0eddd7131.png";
export const matkaM2Hin = "3b516a29-ac06-4ee8-8356-d37ca3dfda21.png";
export const matarM2Hin = "20b72564-3f6b-4dc8-8175-2a050f7b19fa.png";
export const teacherM1HinI = "5bfc4162-cab1-492d-a789-f79025201dc5.png";
export const kalamM1HinI = "1767bd34-da71-40c0-ad2b-b2cb0db31eae.png";
export const acharM1Hin = "6dfbda63-938d-4443-b0f7-2c0585f8a87f.png";
export const koyalM1Hin = "f4ea2a07-1376-4d6c-8242-36fa6be6e5cd.png";
export const kadduM2Hin = "6caba7ed-7e28-4289-8660-5e8528a40f2f.png";
export const takiyaM1Hin = "54c74222-08f0-449d-8ca6-99b9e5ce95d1.png";
export const banarM1Hin = "e68a7b67-7b23-4b33-adb4-babd6cccb3c7.png";
export const santraM1HinI = "c9cf9d50-803b-488c-a4eb-d86c67ca6a49.png";
export const botalM1Hin = "7796805a-26d5-4ff3-acb2-46c57f12ebab.png";
export const tablaM1HinI = "bf8ce2a0-54bb-4e4a-9700-9dd491496799.png";
export const badalM1Hin = "a5c31562-f9ef-42c2-a3cd-78420f0c9dcb.png";
export const bakraM1HinI = "80a31b2d-091a-4b3a-94e7-335c9e0dc123.png";
export const palangM2Hin = "415dd628-31ab-4720-ae29-7bb630580567.png";
export const mandirM2Hin = "29b7757e-c1b3-4f9a-8fc9-cd9d8d2a871b.png";
export const gajarM1Hin = "772308c7-8a38-45b3-9860-748aceeda682.png";
export const langurM1Hin = "19f14bf2-75b7-4d75-adc4-7c8025c1beca.png";

export const baaM1Hin = "d52a9a61-58fa-46f8-a433-d10e02d882f4.mp3";
export const dalM1Hin = "c702eb08-1843-4209-b1fa-c2af9a454e83.mp3";
export const tabM1Hin = "b81f34ad-7c03-4f7e-af5d-ff924d5a3428.mp3";
export const laM1Hin = "669a3adf-57a9-4ebd-bfbe-5d71a1ff7fb1.mp3";
export const chaaM1Hin = "1a9ab41e-299f-499f-8d3e-04794d6417b4.mp3";
export const valM1Hin = "54e8f170-adc7-4a93-bdc9-d2058ed1c5aa.mp3";
export const koM1Hin = "e17f8268-2736-4bae-9c1d-15f97715eb16.mp3";
export const elM1Hin = "6e256eff-ae04-4954-815b-98170f4eace1.mp3";
export const kaM1Hin = "0d065cdb-8f09-455c-b542-6a0ba2770d77.mp3"; // Duplicate key warning
export const lamM1Hin = "13d8e204-a068-4cff-a520-2e68928a7054.mp3";
export const maM1Hin = "50ccaf98-c509-4399-b32f-4df900f3d37b.mp3";
export const tarM1Hin = "85c98ade-0397-4e74-ac7b-d3450783db85.mp3";
export const paM1Hin = "a938f3f1-2f07-4898-afd8-30a470f4fc71.mp3";
export const langM1Hin = "ee347edf-a512-4263-b63f-14d5704e59d4.mp3";
export const matM1Hin = "681f3652-7a4c-4608-862e-c67f8baf81b6.mp3";
export const ka2M1Hin = "2a465a3f-ef0f-49c1-a0ff-d944dd4c2b3a.mp3"; // renamed to avoid duplicate
export const manM1Hin = "5729298e-387e-41a9-818c-c788dea63b7b.mp3";
export const dirM1Hin = "260c70ee-64e2-4e94-bdaa-d119edec8164.mp3";
export const kadM1Hin = "176c6acb-fe1c-4d0a-b6fd-0043e01e7b90.mp3";
export const duM1Hin = "4cefe5fe-d21e-4118-b6cc-bf9c40c29e7e.mp3";
export const sanM1Hin = "676953f1-83a5-44ee-9ae9-4c817f9d0afd.mp3";
export const traM1Hin = "89284dc7-6255-446f-8ec4-67285924e6e8.mp3";
export const botM1Hin = "96e5f0a6-72f6-4525-ad73-135320e20768.mp3";
export const tleM1Hin = "0a637fcb-d1ca-43de-af6d-9b868f9310f6.mp3";
export const bakM1Hin = "e5708886-b28e-4462-acf6-e8136069c12a.mp3";
export const raM1Hin = "fb788fa9-f0d2-4141-9e12-32771c9ed2f0.mp3";
export const aM1Hin = "08f33113-c893-499b-baf1-001eba6173fb.mp3";
export const chaarM1Hin = "2563dd65-e5a4-4e3a-bba8-f57e93f5bf3d.mp3";
export const dumM1Hin = "f8906141-3243-4ada-b5e4-0ddecd9343d2.mp3";
export const rooM1Hin = "33e85072-4684-418f-ada8-9b26074ef1a1.mp3";
export const taM1Hin = "0b51bfd4-6421-44d7-bcf5-2722dd947144.mp3";
export const kiaM1Hin = "32091b92-4626-46db-8ef1-43d44150aac3.mp3";
export const teaM1Hin = "46bda69b-620c-4c4f-9f8e-d1e0d1f07885.mp3";
export const cherM1Hin = "bddbce71-759c-46db-bdfc-5caced9566dc.mp3";
export const banM1Hin = "f2032df2-a6f5-48d5-80f8-dd891bbc609b.mp3";
export const darM1Hin = "9e4a5443-ec51-4785-9672-734289418c80.mp3";
export const lanM1Hin = "db98749a-fb8e-4f1e-966b-4d8f6ccda120.mp3";
export const goorM1Hin = "94876f1a-65b4-4eed-97a7-82175cd031e9.mp3";
export const gaaM1Hin = "b3301559-9179-488a-b023-6a208c71d896.mp3";
export const jarM1Hin = "27ca4d45-f05e-4ea5-a967-adb1d4733fc2.mp3";

export const doorM1Tam = "aa897eb6-4ed1-49c3-90d8-bd5d44ca23cf.png";
export const mushroomM1TamI = "3229529c-a304-41f6-86d1-f02174d9c203.png";
export const riceM1Tam = "b38e9ce0-fc71-4340-8c8c-a29c5b514c56.png";
export const socksM1Tam = "59b2e4c4-e75a-4fde-9bf2-5d7205cbaf1a.png";
export const treeM1Tam = "fb67a709-a547-440c-bc52-9ef8a56265a6.png";
export const pomegranateM1Tam = "cee967c4-36f6-48e4-ae54-e217d65e9899.png";
export const foodM1Tam = "6ce228bf-2da4-42c2-b469-d97a98a32eaa.png";
export const horseM1Tam = "78df6371-9379-4c13-b615-ef3ab3cb4697.png";
export const shoeM1Tam = "8c54e54b-36f2-4af9-a56d-9ebdbd410271.png";
export const timeM1TamI = "243a1938-fb68-4ef3-bdd6-1cd6f22445a1.png";
export const squirrelMTam = "f955d547-8a67-4c92-8496-3a50db7099ed.png";
export const peacockM1Tam = "26f01c4e-215f-4e27-bc1b-eaa7134e00ea.png";
export const blindM1TamI = "d566e3d0-77f8-4074-83a9-9e9a4e3508a9.png";
export const skyM1Tam = "39f08af4-0d46-4982-b13e-7b608efcc1b8.png";
export const mugM1Tam = "361ad958-120e-45ad-bd60-8df60c7bdd91.png";
export const wheatM1Tam = "f4d9ca84-6392-48bb-a8fe-a488d2cc0798.png";
export const carrotM1Tam = "69a482b8-be50-4b8e-aa8d-e3c2cc451322.png";
export const sailorM1TamI = "8b287776-0b44-4688-947e-7fdf1086e2bb.png";
export const youngM1Tam = "e22ca0fe-fdc6-40dd-821d-d0500ded3c35.png";
export const lotusM1Tam = "45b88a14-dcbb-4e8d-aa4a-8929cd74f6fe.png";

export const time2M1SylTam = "acc5f376-2c33-4092-a250-e74a440173ea.mp3";
export const blindperson2M1SylTam = "40e7935c-572b-4a02-a1e6-04aedb44d9c9.mp3";
export const sailor3M1SylTam = "e06e9603-3e26-40d1-a530-f1ab72a1a4d9.mp3";
export const youth2M1SylTam = "28d4b146-538e-4444-bff0-46a8a3b93938.mp3";
export const rice2M1SylTam = "206098e5-7a91-4980-90ef-c9f3a6f6fc39.mp3";
export const wheat2M1SylTam = "c110a77a-5f43-4bc3-a436-6fa56e152059.mp3";
export const lotus1M1SylTam = "006da4fd-bb37-46b4-b006-c1b8bd43b6eb.mp3";
export const pomegranate3M1SylTam = "834535d0-0f17-4f4b-969e-6514920fe385.mp3";
export const horse2M1SylTam = "e543856b-8d81-436d-9159-3523b798c123.mp3";
export const door3M1SylTam = "dc2a1904-bc4b-4285-946c-0ae701357c7b.mp3";
export const tree1M1SylTam = "67f65ac3-9ad9-4b41-827f-add27755c352.mp3";
export const peacock1M1SylTam = "42cbf647-7de4-4c65-9db7-961f9df62bd0.mp3";
export const tree2M1SylTam = "20669005-7710-4e92-89c6-be1a0851fdc6.mp3";
export const peacock2M1SylTam = "c87aea80-b7d0-44c4-bf06-26ddf49e1839.mp3";
export const sailor5M1SylTam = "36f17205-5cb8-4e1a-839d-9dcb188a9ae2.mp3";
export const horse1M1SylTam = "c769aedf-a687-4edf-b068-10c5fd2c46e5.mp3";
export const lotus2M1SylTam = "8d62d669-0957-4a6f-8bce-2b8328bbda23.mp3";
export const wheat1M1SylTam = "c11b3af8-9398-4331-9c61-8f03e8189d17.mp3";
export const rice1M1SylTam = "c4a3cc50-247e-4027-8954-3014372919ed.mp3";
export const food3M1SylTam = "ca04f4b1-16a1-4b02-a59a-16dad5f6cd38.mp3";
export const sky3M1SylTam = "7472b739-897a-4966-98cc-f66a1bb391b5.mp3";
export const shoe3M1SylTam = "9473e74e-a9ad-4d7f-818d-246f1cc9d62e.mp3";
export const youth1M1SylTam = "65b09d0e-a880-4b8f-a1a9-fe2692009cb1.mp3";
export const blindperson1M1SylTam = "e39706e4-bbbb-4b7c-81a5-dd07ca67e6db.mp3";
export const time1M1SylTam = "0d41d8f7-00fd-4608-8e5c-4148d41e94f2.mp3";
export const door2M1SylTam = "3005baec-a55d-4fe7-9cb3-4d800abce74c.mp3";
export const horse3M1SylTam = "8f630550-47c4-4d69-a037-9864ed7f65ab.mp3";
export const pomegranate2M1SylTam = "94ba2aca-b3ae-4e94-8922-394380dae80d.mp3";
export const mug1M1SylTam = "97060d1c-e03e-4ba2-858d-0bba245e4098.mp3";
export const food1M1SylTam = "74ba1e86-cd4b-490a-a28c-e0a0946bc389.mp3";
export const shoe4M1SylTam = "ee43797d-69c2-449a-9065-c733971f3ae1.mp3";
export const rice3M1SylTam = "e7f2980d-d1ba-4426-928a-93eb2a95d9dd.mp3";
export const wheat3M1SylTam = "b21a05e0-1b3a-461d-9dce-047d3f8d87bb.mp3";
export const sky1M1SylTam = "acb5ea66-b39d-4dc0-8217-f0ab05c74989.mp3";
export const squirrel2M1SylTam = "e8bcd856-eb1d-4eff-a317-1af8dc1bd175.mp3";
export const wolf2M1SylTam = "960b775e-5aaf-4848-aae4-e380e6588f8a.mp3";
export const shoe1M1SylTam = "26c4fdc6-630b-4943-b3c3-40bb5604f06c.mp3";
export const carrot1M1SylTam = "e3435555-e30c-468a-a6e9-819176f0bcdc.mp3";
export const sailor2M1SylTam = "ef23fc5a-2074-4b61-aa83-e726310a6678.mp3";
export const mushroom1M1SylTam = "236a84fd-3ae1-4a7d-9b70-058ff7d2d417.mp3";
export const mushroom2M1SylTam = "fd0209bb-404e-4648-b6ff-9acd9aa03332.mp3";
export const sailor1M1SylTam = "06f905dc-bd69-438b-b35f-ad3771d4507f.mp3";
export const carrot2M1SylTam = "7c746185-dd28-493b-aa84-2ec94f04ff9d.mp3";
export const wolf1M1SylTam = "b5907cbd-fbde-4071-839e-5369b62692ef.mp3";
export const shoe2M1SylTam = "5573b710-8ba0-4f2b-973f-401e2ffcfaf0.mp3";
export const squirrel1M1SylTam = "f5ddce0d-7d2a-462b-979f-e4bb5d530bd4.mp3";
export const sky2M1SylTam = "0d1b1d1d-2db2-452d-9478-73b86aaf20ad.mp3";
export const mug2M1SylTam = "25cee6f9-fca6-498c-a7f0-2b1a192c3ba4.mp3";
export const food2M1SylTam = "2ca688d5-220a-442d-bf50-bf1ed7dfe28f.mp3";
export const lotus3M1SylTam = "8a7ddb5c-ac21-4d2c-8429-a52cd793cb88.mp3";
export const pomegranate1M1SylTam = "07bdced8-c4b8-49a3-b793-9c5938f01206.mp3";
export const door1M1SylTam = "85b66b4c-cccc-4b2a-887c-3cf387e79307.mp3";
export const sailor4M1SylTam = "d30ad8f2-6019-4208-821b-307a3c5a3db1.mp3";

export const vehicle2M1SylKan = "6c55256f-ded9-44bb-a64e-bf5cad108105.mp3";
export const lotus1M1SylKan = "f35ede6c-d179-4b26-b873-b805e80b3cb4.mp3";
export const lemon1M1SylKan = "3b1874c7-6cee-4031-9c08-8cec00bdbea4.mp3";
export const family3M1SylKan = "9debddb0-9a50-4b34-964f-65ae3e08318c.mp3";
export const spoon2M1SylKan = "a8e9c541-e000-4970-a546-19e92b51f227.mp3";
export const king2M1SylKan = "e0832e16-d88d-432e-a002-4a4dafc28e62.mp3";
export const boy1M1SylKan = "b5755731-597a-4d0e-8219-5ee3688596df.mp3";
export const singer1M1SylKan = "1ffe1acd-e189-4e91-8de8-40a65472d2f7.mp3";
export const tabala1M1SylKan = "ee793e5a-1a73-4109-acbf-ac8170f68e87.mp3";
export const washerman2M1SylKan = "ac352cd1-260e-4c3c-b4a7-669d7b1b3d10.mp3";
export const ship1M1SylKan = "ff09ccf5-0539-4e2a-a69a-91fe33d34d95.mp3";
export const mathematiccs1M1SylKan = "4567687c-8db7-4ad3-ab78-a840139fd82c.mp3";
export const ship2M1SylKan = "a6dc743e-15cc-4574-9ea8-d1ea1e9cb50b.mp3";
export const mathematiccs2M1SylKan = "1d162fd8-1be5-4957-8c7b-660d44b75215.mp3";
export const washerman1M1SylKan = "ee92fe80-9d6c-4349-a137-4b5a9e829203.mp3";
export const bear3M1SylKan = "b007d1ee-6d82-4ed6-b6d4-28a07cd7a698.mp3";
export const peas3M1SylKan = "5f5c1cbc-a167-456a-b2a0-0dedfa9c7b2e.mp3";
export const jackfruit1M1SylKan = "5769f251-da31-42c0-97b2-aa697d28042f.mp3";
export const tabala2M1SylKan = "4882d72d-091d-4f3a-8f2e-8c6d99bfd43a.mp3";
export const singer2M1SylKan = "aec240df-4bd2-4f1d-81e8-82f63f63afff.mp3";
export const king1M1SylKan = "d2274d26-7d1a-48b0-9fac-c2c8a423fb84.mp3";
export const boy2M1SylKan = "4d1f641e-3c5f-4816-9fff-e33eb572327d.mp3";
export const cabbage3M1SylKan = "3af381b4-ab10-4448-a30b-bd12645edaaf.mp3";
export const spoon1M1SylKan = "c599d0bc-0a8a-42e6-9914-7519cffed8de.mp3";
export const human3M1SylKan = "d2247793-5dfa-41ad-bde4-386edee45037.mp3";
export const lemon2M1SylKan = "4c9eea1c-766d-499f-8251-108bf12a2a35.mp3";
export const lotus2M1SylKan = "9fb68d1d-10a6-4129-a74e-0f3dc17b7db0.mp3";
export const vehicle1M1SylKan = "951ea057-6910-4216-a05a-39e34f913a30.mp3";
export const washerman3M1SylKan = "898fc8ac-2e6a-4d2f-8c40-55e29ea7cbb8.mp3";
export const bear1M1SylKan = "03742a21-7988-4c72-ae0b-fb38b37ac524.mp3";
export const peas1M1SylKan = "943a301b-c878-4465-98b4-bc52f3d25840.mp3";
export const earth2M1SylKan = "c64ba931-da8d-441f-850c-4d30e7742195.mp3";
export const fish1M1SylKan = "8e5cc28b-521a-4e0b-ae06-259b46d63f8e.mp3";
export const jackfruit3M1SylKan = "20c0bc38-1270-4d57-977a-95760e81bfe7.mp3";
export const cabbage1M1SylKan = "65f95867-c793-4732-a286-55303c368fcc.mp3";
export const spoon3M1SylKan = "32249960-68e9-4d1b-bd54-ae1c16794a67.mp3";
export const king3M1SylKan = "8467df63-73c6-4c4b-9e85-55b861477937.mp3";
export const family2M1SylKan = "001575b3-99cf-4221-a331-c05b39d622ea.mp3";
export const human1M1SylKan = "5025dbd0-e10f-4e88-9105-432323aa1e93.mp3";
export const coffee1M1SylKan = "8aab85e4-e1ac-4d91-bac8-3a80d9019836.mp3";
export const vehicle3M1SylKan = "c6439609-177c-4bc0-b722-b474dd48bf16.mp3";
export const lotus3M1SylKan = "fb39292d-7f29-465c-ba34-2cc3cfddc087.mp3";
export const coffee2M1SylKan = "70bb856e-6bb8-4175-b12b-22aa99b5b567.mp3";
export const human2M1SylKan = "0bcd1126-c9dc-4f05-8b76-320d2c1db1c1.mp3";
export const family1M1SylKan = "49f1253a-81ea-4f2b-98f1-67958fa8a052.mp3";
export const boy3M1SylKan = "7838b942-8ec1-42d6-9d54-d8b60847adc6.mp3";
export const cabbage2M1SylKan = "8ec331db-4ab4-42c7-986e-ef871722fe74.mp3";
export const tabala3M1SylKan = "1657d09e-2e41-4f77-a0ff-dda9f78b6a5b.mp3";
export const fish2M1SylKan = "1aedd69b-8df9-4962-aa71-e839f4fbfc12.mp3";
export const singer3M1SylKan = "0c5f9348-a0a4-41a2-a0b4-c4de7d0d78e1.mp3";
export const jackfruit2M2SylKan = "9e85eb06-89c9-46d4-9c94-bd0eaed86be8.mp3";
export const peas2M1SylKan = "37fa8611-82bd-4062-84fc-62d1c561ff7c.mp3";
export const earth1M1SylKan = "33cb4310-4634-451f-a893-0af42c004cea.mp3";
export const bear2M1SylKan = "7284a405-5405-4407-bc80-823dc0ddeed4.mp3";
export const mathematiccs3M1SylKan = "5d91a942-6e6d-4f79-8e78-7649c544b685.mp3";
export const ship3M1SylKan = "fed6dbaa-d518-42db-b8bd-39f270124481.mp3";

export const singerM1KanI = "93463bfd-83e2-4ff1-a572-4a6618ae5fcf.png";
export const mathematicsM1KanI = "ccba50dc-f915-476a-8051-edc4d1c8aa33.png";
export const boyM1KanI = "6e72fd11-0923-4b65-b468-a7b40d7b9f0b.png";
export const peasM1KanI = "57a493f1-b1a1-45e2-beb1-b8bb5e0de458.png";
export const fishM1KanI = "2fabac09-4170-451e-a671-cb2b0fd999fc.png";
export const shipM1KanI = "6c7e4122-3704-436c-82bb-6195b61cf8da.png";
export const humanM1KanI = "66806f76-ad23-43f1-8893-328a8e09b456.png";
export const familyM1KanI = "a505128b-ba14-4fb5-bd73-d4e236a9152c.png";
export const tabalaM1KanI = "ab05f9ae-f242-4852-9266-1ecd1395af85.png";
export const jackfruitM1KanI = "ce0ef22b-2a76-44e4-8279-99c5fa60c88b.png";
export const vehicleM1KanI = "aac29147-bb76-4f47-a453-2ef7f8d0dd03.png";
export const lemonM1KanI = "f7d969c7-bb42-4fa1-9572-5eb6bd937327.png";
export const bearM1KanI = "9381278f-7543-44e8-8515-13d1f89f2722.png";
export const lotusM1KanI = "5733edee-1aff-43d4-bb6a-a1a0217f5094.png";
export const kingM1KanI = "359115b6-d29b-42fc-9e38-2103cdb9bb24.png";
export const earthM1KanI = "a969c176-6b68-4215-8a74-458a3ea055d7.png";
export const dhobiM1KanI = "bdfbcc05-c8b1-439e-98f3-7b272cbaf13e.png";
export const spoonM1KanI = "a696c167-772d-4e63-90c5-fa0481fe2057.png";

export const ear2M3Tel = "704c3a8d-62c3-48a7-bbc8-c88f7fc0c480.mp3";
export const squirrel3M3Tel = "a41b153c-0078-407e-8049-fe7cb9a49fb2.mp3";
export const squirrel2M3Tel = "348a9b8d-8e6c-41ff-84ba-71a56ddbb850.mp3";
export const lotus1M3Tel = "a8603b09-5016-40c5-86dc-b7a3f764153d.mp3";
export const sparrow1M3Tel = "b749b149-be2e-4efa-b41f-a5f2181ccf2a.mp3";
export const jackfruit1M3Tel = "aa9a32c8-1157-403a-a49c-b43d177886fb.mp3";
export const door1M3Tel = "a0751c39-508e-4e77-a92b-b022ef0b9a20.mp3";
export const rat1M3Tel = "1a9d7ea4-b9a1-4121-ab2b-c3be2c505f51.mp3";
export const donkey2M3Tel = "a9830e59-942f-4535-95df-edae5139987e.mp3";
export const donkey3M3Tel = "0e9c0e63-a7a8-431e-a956-485e2cc25094.mp3";
export const spoon2M3Tel = "73474b3e-3f39-4fa2-bc23-fe7091fd8fad.mp3";
export const tongue1M3Tel = "985fb9c8-6031-489e-910f-22a5c97d152f.mp3";
export const hand2M3Tel = "b2b31ea8-fce2-458f-90cb-603ff41848cc.mp3";
export const parrot3M3Tel = "149647b7-522e-4fb4-acfa-45a1c5061649.mp3";
export const parrot2M3Tel = "e0537af3-4ee9-431f-b337-2d85b48fb449.mp3";
export const jar2M3Tel = "da375497-9548-4888-adbb-694e271c7cff.mp3";
export const banana1M3Tel = "38b53e9c-a4fb-4c0b-bfab-a9ebc662eb61.mp3";
export const kangaroo3M3Tel = "f6d7c9a7-85f8-4f0d-aec2-f99f134da118.mp3";
export const kangaroo2M3Tel = "86455c82-477b-4ce2-81bd-2c72bcb56df7.mp3";
export const bottle1M3Tel = "ba56a9b8-ade1-4a6f-b289-d103fda2bdc5.mp3";
export const earth2M3Tel = "8ec80ba1-05aa-4306-87e5-f923ca1b4fd4.mp3";
export const ring1M3Tel = "c403bd6f-8157-4561-bcf1-6c7e4fc85e1a.mp3";
export const boat3M3Tel = "72fd6b19-8471-44c9-8c7b-d9df83eb0ef2.mp3";
export const boat2M3Tel = "78466969-723a-47a5-a8a2-16d579676271.mp3";
export const roti1M3Tel = "c52c029d-7cff-422e-b347-4e3cddb7c81b.mp3";
export const door2M3Tel = "a457b0cc-aa4f-4086-9c14-0ce0806e3e98.mp3";
export const door3M3Tel = "a6c7d02f-e899-4844-913a-006fb54538dc.mp3";
export const rat2M3Tel = "a8bff18e-381e-4649-abac-8da3f1759b8e.mp3";
export const rat3M3Tel = "6972d339-4a36-4c0f-9bb2-ec4b1a34f2fe.mp3";
export const donkey1M3Tel = "fc8f6fa6-c048-413c-b426-6c2824fadaf7.mp3";
export const spoon1M3Tel = "c07c44e7-bc8d-42e3-863d-524687ec82ce.mp3";
export const jackfruit2M3Tel = "1bd8fccf-206b-4de3-a13e-8d3c2d75dc27.mp3";
export const squirrel1M3Tel = "a9b64100-8c30-476a-8cfb-c21f27e0218a.mp3";
export const lotus3M3Tel = "464e3768-d8ae-4826-939c-caad11d779dd.mp3";
export const lotus2M3Tel = "71b2f14e-738e-4f06-bee8-dbaf331a5e32.mp3";
export const sparrow3M3Tel = "abb5b3df-542f-4c77-984b-50e9670c6881.mp3";
export const sparrow2M3Tel = "dbec7d50-b136-48b8-a9ec-ff0bba74e64b.mp3";
export const ear1M3Tel = "573a2dac-c04d-459e-8ac7-ff88a023e336.mp3";
export const ring2M3Tel = "676e2e19-03d1-4b2b-81e3-8b3c651f385c.mp3";
export const ring3M3Tel = "a268d35d-2046-4ad1-bced-b4a140211ff5.mp3";
export const boat1M3Tel = "6cf4051a-6665-48b5-b432-f6466c048533.mp3";
export const roti2M3Tel = "39c0cad9-825f-4742-b5ad-47a81c9c3822.mp3";
export const banana3M3Tel = "2454b586-4b9c-4166-bdd8-6b75c1fcfbcb.mp3";
export const banana2M3Tel = "21aa3e4f-33a6-4a8f-ae05-b153b8cb5cef.mp3";
export const kangaroo1M3Tel = "28c4c537-f42a-4b61-8ed5-22160bc866a9.mp3";
export const bottle2M3Tel = "13fabfdc-32fd-46e6-83f7-bfaa68ec59a8.mp3";
export const earth1M3Tel = "b21b63a0-cf48-4637-94ce-30861a642ef0.mp3";
export const hand1M3Tel = "8da920f2-dd4b-43be-9ef4-41f64b56002b.mp3";
export const parrot1M3Tel = "5f48ed96-9ed1-4816-9445-d1aefd3da994.mp3";
export const jar1M3Tel = "222b2a89-810f-4074-af82-301d4f59e005.mp3";
export const jackfrui31M3Tel = "491bf916-4be5-472a-b8a2-02f38d565ed0.mp3";
export const tongue2M3Tel = "4e956907-27d1-451b-a9be-9243a490cb8b.mp3";
export const tongue3M3Tel = "417e26c5-5a9d-445d-8f6d-38002591b724.mp3";

export const jackfruitM1TelI = "890aede0-6dfc-46c4-9ec9-d0416eb98b95.png";
export const jarM1TelI = "814ff70a-4661-4e77-aa3e-ea721e2bedfd.png";
export const ringM1TelI = "38b1e680-b954-4d10-94dc-3a4574663ee2.png";
export const squirrelM1TelI = "fad903e8-172e-4d66-a990-6f017f40fd11.png";
export const spoonM1TelI = "f9c90e5a-fa29-4b61-ab4b-23f414a3929b.png";
export const earM1TelI = "59bb0940-beee-4b53-81b7-a215bb1ed4ad.png";
export const earthM1TelI = "3f69d55f-b111-4b48-9fe9-675793df8bff.png";
export const boatM1TelI = "204c7b28-a1c5-463a-852b-52614d9cdb3a.png";
export const kangarooM1TelI = "cb90859f-a33c-4043-8d38-4bcd767a258a.png";
export const lotusM1TelI = "ca721a5a-e7b8-4e22-84f6-9c8f85932a4c.png";
export const handM1TelI = "71e103df-7308-4965-ade2-05bd59574782.png";
export const doorM1TelI = "22c21888-c41c-4cc8-8bf9-a737b23e9ed7.png";
export const parrotM1TelI = "a3405509-9be0-458b-8667-2cb528f03591.png";
export const sparrowM1TelI = "b5af1bd8-e52d-4577-b282-f03d840d858f.png";
export const rotiM1TelI = "9d40958e-ebaa-4a39-b3f6-0fc47a52edca.png";
export const bottleM1TelI = "f8732454-22ae-4df4-9fdb-6af6c6e68036.png";
export const ratM1TelI = "ff4cc3ca-c695-4fa4-8267-8d7c7a4f715a.png";
export const bananaM1TelI = "cc33afa5-b1db-4f20-8f3a-e606c7888aa0.png";
export const donkeyM1TelI = "bf9d6ceb-72d8-4996-a840-526d27356726.png";
export const tongueM1TelI = "cefeb03b-1f13-40e6-ad03-e7a8bd03a693.png";

export const jackfruitM1Tel = "ac269441-83d8-4d91-af4f-8f2e9a4a0ae6.mp3";
export const squirrelM1Tel = "1be5ac02-46f4-46f2-81a4-5f096e2188dc.mp3";
export const ratM1Tel = "4b127121-1408-472a-80f7-acdd1090ac6a.mp3";
export const boatM1Tel = "90a7350d-5133-478d-b725-67021262a298.mp3";
export const ringM1Tel = "0a716855-a880-4c76-96c2-bc05d30e9ada.mp3";
export const bananaM1Tel = "0e984888-387d-46b2-8047-fb5571f77ed2.mp3";
export const donkeyM1Tel = "4455d2b1-da01-4a6d-a8ac-8dfa2b15f2a1.mp3";
export const doorM1Tel = "ad65c463-34ce-4c1a-8726-f5d00e59548f.mp3";
export const parrotM1Tel = "2dccff3f-9e2c-4b67-a12e-60ddab0f9cfc.mp3";
export const sparrowM1Tel = "0d074bb5-58c8-4dc8-8bae-9c02c378cc36.mp3";
export const lotusM1Tel = "19ba1e2b-1ae1-4cd1-a6f7-369871cefa20.mp3";
export const tongueM1Tel = "1c54116a-7aeb-4c40-af02-b58b46b7f720.mp3";
export const kangarooM1Tel = "235d494e-2648-4db1-b22b-d857345adbc0.mp3";
export const spoonM1Tel = "3e8a3af3-706b-48f9-8e68-85b0b96a7a28.mp3";
export const earM1Tel = "5bdd1d40-52c1-43d2-bb89-df90af0df6e6.mp3";
export const handM1Tel = "f4c423b2-d6da-41ee-b727-e4462663fa99.mp3";
export const jarM1Tel = "6fa88fc3-1814-4096-bb9a-c0d8407929d7.mp3";
export const bottleM1Tel = "1ba71eaa-4785-4171-8123-953b267a2592.mp3";
export const rotiM1Tel = "8b0def90-496d-4dc0-a711-ea75eafc50a3.mp3";
export const earthM1Tel = "f1ab0592-f998-4851-a9a9-c42a50f9373f.mp3";
export const eagleM1Tel = "94827a18-7c74-4a56-8369-b8e7d219f834.mp3";
export const basketM1Tel = "f0b37a14-0e6a-4433-be15-268326282b18.mp3";
export const soapM1Tel = "b3f77b8d-6548-4f53-bb63-e68890593732.mp3";
export const frogM1Tel = "cdda66f0-84f1-4a8c-b1d8-568afb470ce1.mp3";
export const dogM1Tel = "343d5aa9-7b65-442d-a575-61904ab0ddf5.mp3";
export const tableM1Tel = "44a564a9-3cf7-4e51-922c-107751fd6aea.mp3";
export const eggM1Tel = "4a4b5195-fcb7-4752-8337-1eb7dfc47204.mp3";
export const cloudM1Tel = "e6a30347-1bb8-4ff5-93e3-98af3b1eba65.mp3";
export const saltM1Tel = "147e0a4d-26f7-4dd0-8311-3d436fa247d2.mp3";
export const plantM1Tel = "adbbda0b-4886-4bf7-926d-97d0c1cbca21.mp3";
export const fireM1Tel = "4e288968-2eb9-4391-ad8d-b955c9f7d1c4.mp3";
export const knifeM1Tel = "37637ad0-97aa-4f31-9cc5-6fd49cc2e140.mp3";
export const horseM1Tel = "26712bc4-2d12-4752-b7b5-d1f25ff9735b.mp3";
export const flowerM1Tel = "bc1c61c6-a94a-4b65-98fc-55a271b947a9.mp3";
export const gingerM1Tel = "5394062e-c842-4756-a5e5-413a8e244fa7.mp3";
export const rangoliM1Tel = "b9bb1078-f875-482e-b48a-48e2dde6cd15.mp3";
export const gandmotherM1Tel = "a4d03c75-7fa7-4e0b-8dd0-6f888827f195.mp3";
export const busM1Tel = "d6a06e7e-db37-4013-b965-a258fd7c78f6.mp3";
export const drawM1Tel = "87d9db06-961d-4beb-ae35-a457e5c9b9bd.mp3";
export const boneM1Tel = "6973c2c9-df61-4be2-89c5-e48f0fa5ea1c.mp3";
export const brickM1Tel = "b5238a9d-d3a8-4501-9da5-86723f34f758.mp3";
export const festivalM1Tel = "f0e6d15c-088f-435f-b11a-533f3f80e5d4.mp3";
export const blanketM1Tel = "cc730f2f-c0e5-42f3-8238-f5aa81bd7813.mp3";
export const boltM1Tel = "c3ce1a2b-e2d1-4ee2-b777-64f8c290be32.mp3";
export const dhobiM1Tel = "1f0b2330-c802-443e-9a5a-a90d39cedbff.mp3";
export const grasshopperM1Tel = "9a22899b-2bef-449c-ae6f-ba4abb6dbf06.mp3";
export const capM1Tel = "d83f205b-2c33-46c7-a0db-e6af8d0f26e0.mp3";
export const grassM1Tel = "083f1ace-2347-4fec-8e57-2f0de95ab476.mp3";
export const ladduM1Tel = "e99e2fb7-1c05-41f6-b822-940851d00320.mp3";
export const laughM1Tel = "4b1f0aa1-2186-4c08-bdd2-cc00f4dc5b9e.mp3";

export const singR1Eng = "d8c2602f-a10c-480c-9e1b-7755aaff6234.mp3";
export const rainR1Eng = "4466f3ff-2a44-4763-bf8b-f051f53b0cea.mp3";
export const sunR1Eng = "3f3d1a2d-c85e-457f-96cb-06f45a69a7a0.mp3";
export const parkR1Eng = "70c22b30-06b2-4210-be28-72ff2b21e033.mp3";
export const kiteR1Eng = "047644a9-636a-4425-96c3-56c96988a69e.mp3";
export const manR1Eng = "4eb41d5d-1f24-4232-8adf-4fac9fc886ab.mp3";
export const eggR1Eng = "e12f26b0-2860-434f-afef-600d5ea0be3c.mp3";
export const trafficR1Eng = "3c706623-03a6-46b2-8c28-7d53b031731d.mp3";
export const carR1Eng = "5aa64e14-2ed5-4bc7-bfe0-69aef32d4d3b.mp3";
export const cakeR1Eng = "68409968-0e3b-46de-b175-7a4ea047e132.mp3";
export const hatR1Eng = "8b7a008c-2ed5-45a5-9718-22ef66d6c925.mp3";
export const jugR1Eng = "abbd98ce-2955-4657-b29d-0c467b1e12fa.mp3";
export const fanR1Eng = "f086fba8-ca42-4e1c-baa1-d578059b445e.mp3";
export const vanR1Eng = "45494943-c151-48af-a278-d72da08b3557.mp3";
export const shipR1Eng = "e6f717ea-316c-4910-8e05-a6a97090f7e4.mp3";

export const saltR1 = "dbd30617-6f08-4a69-95b3-9022ee7616e4.png";
export const eggR1 = "643d2b1b-432f-4f7b-b4ea-ce1471ba2b86.png";
export const trafficR1 = "64fa74c1-201c-40e4-849f-30da1723c164.png";
export const carR1 = "7305bb41-80b8-4acb-84b2-0b89f41206ff.png";
export const legR1 = "26fc5266-dede-4669-9436-2496aac0c908.png";
export const aimR1 = "3c159e3d-1e73-4082-b800-1eddedd740ae.png";
export const soapR1 = "cad91b6d-e23e-469e-963a-e4e131ed143a.png";
export const beltR1 = "a44c710b-661a-48f8-8886-6d2e8c48be5c.png";
export const pigR1 = "12fa5d78-640a-4f24-953f-adbae9473872.png";
export const hutR1 = "c2f1c1c4-190a-4d6f-8ab2-2395d363897c.png";
export const hatR1 = "a1a5f21b-ec4b-4db0-93eb-057fcc20bc1a.png";
export const giftR1 = "0e0edb67-b4a9-452b-a3f3-92c6d79d5af7.png";
export const cryR1 = "bc4bacaa-7cef-452d-865c-a15ad1b8464e.png";
export const shoeR1 = "c6e1f9b6-8863-4552-8228-4123c256f8df.png";
export const vanR1 = "d1c6c7dd-3c93-48c1-a837-3bd3509d7359.png";
export const hugR1 = "a671cd23-0c6b-4438-9881-9880c7f9af9d.png";
export const fireR1 = "4c073717-1e58-4e30-a4fd-6ad31398096d.png";
export const fanR1 = "ad5c26c9-a0ed-4f72-b3cd-3d2f548e4ec8.png";
export const sunR1 = "1314cc9f-fea2-45a2-8b04-e07374456eed.png";
export const cubR1 = "7ec09317-229f-42ec-9e16-c7c56fb11f17.png";
export const mangoR1 = "09e68d7a-75d6-4de2-992d-98732a27e983.png";
export const rainR1 = "7fe91e0a-d0a2-46b0-8e06-e6b18eeb54d5.png";
export const rootsR1 = "63e45f28-7ed4-40f0-b82d-421751057ca7.png";
export const kiteR1 = "1cac0ef2-c8a6-44fa-b402-5120fcdac9b4.png";
export const flagR1 = "e7a13fdd-6ccf-4595-98c5-b97697887e02.png";
export const bodyR1 = "fca5b1d4-a12c-4bca-80ec-e4c0088d03df.png";
export const beeR1 = "09966be3-97b3-49ad-807a-d9948549b0e3.png";
export const pearR1 = "f6739760-191b-49f0-8e37-29c66ffcb25d.png";
export const bikeR1 = "d35d9600-5e5c-4da1-b4f5-b19f85ae6371.png";
export const farmerR1 = "aeb7efe3-1864-438c-9f10-8d45ea658dcb.png";
export const singR1 = "10827b42-6900-40fc-93ce-d2061c5115d1.png";
export const shipR1 = "01266381-8c54-4523-b500-9daddf4b356f.png";
export const manR1 = "9c3691a8-c340-4a34-998b-b103bdadba8f.png";
export const cakeR1 = "34ec9341-fd11-4b91-a1da-e60db96a4837.png";
export const jugR1 = "64390e7d-4f0b-4c99-9c58-4501aa852105.png";
export const tieR1 = "24cfaed7-406c-4259-b045-2bc0648ab1b8.png";
export const inkR1 = "db973da7-d3a2-439b-921f-5ae245c1f2b4.png";
export const antR1 = "d1e53905-0582-424d-9548-4e170a9db190.png";
export const gateR1 = "b41ab2a3-3666-44e0-8661-84c0e89db9d8.png";
export const trayR1 = "02c3aead-fad1-4151-bdbc-54d4a95ee0d7.png";

export const jugR1HinAud = "87be18df-73f2-458f-9fa2-2a8f13b03a0d.mp3";
export const jalR1HinAud = "6510984b-32e2-454d-a66e-32f633a5b7aa.mp3";
export const kadhR1HinAud = "d2caf6ba-2b5c-4c1d-99c3-3a8ce8ec6515.mp3";
export const cupR1HinAud = "583ada06-0fde-4da9-88ce-6c8365bdd546.mp3";
export const lunchR1HinAud = "ed49b28a-f35b-4668-894f-2888b88bce44.mp3";
export const cowR1HinAud = "b02a0be9-def0-4b6c-9dbc-f4e10cfb7170.mp3";
export const gadaR1HinAud = "c2cc0b7b-e2a1-40ef-842b-b7278e3493b2.mp3";
export const carR1HinAud = "02b2ce11-288e-4377-a063-99290352be23.mp3";
export const oonR1HinAud = "8a7ff483-d604-42fe-8704-5a2251a05dcc.mp3";
export const kamalR1HinAud = "9e74c4f7-5d3a-404d-93e8-20b6460f6d0e.mp3";
export const nakR1HinAud = "99d83cba-ade3-474e-bc95-3e2c30b516f9.mp3";
export const phalR1HinAud = "a02062f4-0a44-4771-acc2-eb891e35b298.mp3";
export const nrityaR1HinAud = "ea9582c4-b837-4790-ad20-05d04288da0c.mp3";
export const pashuR1HinAud = "43c4382c-7874-4c03-a4f0-8c99407e66a6.mp3";
export const daantR1HinAud = "43c4382c-7874-4c03-a4f0-8c99407e66a6.mp3";

export const cheetahR1Hin = "94ee9262-2f1c-479f-898f-5fdb2c877434.png";
export const featherR1Hin = "a5a66b3f-503f-43ed-b976-5d02373e708f.png";
export const jagR1Hin = "22399f40-e591-41b9-98d0-bdf74f9e5843.png";
export const eidR1Hin = "2c298f83-7b25-421c-92bd-d32fa33e5e9d.png";
export const woonR1Hin = "a9a06c58-6459-4bd8-b7a3-24b5826f9777.png";
export const lockR1Hin = "d19e6529-40a5-4dcd-a71b-1c98fbe885d1.png";
export const coldR1Hin = "a01a6730-263e-4a03-8300-d286ab46bd0b.png";
export const timeR1Hin = "024ea6e4-8dee-4760-9f19-3ee344e7e216.png";
export const medicineR1Hin = "6b7d9d1a-27d0-4cab-8f0c-91334b6a4656.png";
export const peacockR1Hin = "554b6d6e-5bad-471d-bc42-9eea4826f601.png";
export const womanR1Hin = "53f84ddc-b118-4dfc-a327-8001d5aec039.png";
export const duckR1Hin = "8265bce8-a1d0-4e82-9188-ce5a3286073f.png";
export const bagR1Hin = "142877da-fe87-4735-8d23-5f781fb74849.png";
export const kalasR1Hin = "37a2982f-f262-4232-9577-36cab432d40d.png";
export const mugR1Hin = "7a13f0fe-3c73-42bd-89a3-146fc13469fa.png";
export const jaalR1Hin = "5f8149e8-5830-4961-9702-d33fdc3097c3.png";
export const dandaR1Hin = "e7473e7e-22a9-4ee3-8e87-5e462077ebda.png";
export const lionR1Hin = "f8e9635f-59b8-40c0-81d0-640642b46023.png";
export const AutoR1Hin = "c19dd24b-c1f3-4ea5-a5d3-35daa281d58f.png";
export const saltR1Hin = "35679283-bb50-4089-9785-5a62b3898811.png";
export const gadaR1Hin = "4026edda-b3b8-49c4-b868-c1fb3e9e9844.png";
export const BrushR1Hin = "2aece540-fc5d-4c6c-a8e1-7830f8a3868b.png";
export const cupR1Hin = "9311dbdf-2f78-4960-8d21-cb11379d98fa.png";
export const carrotR1Hin = "b5b2cd8c-791d-4109-b37e-2f412e183d7e.png";
export const batR1Hin = "04dbd063-c1d4-4a5a-88e7-624db87cc487.png";
export const mathR1Hin = "4f1b5f28-d5ca-4a32-848d-a02e15bb8164.png";
export const dressR1Hin = "1975dfee-a248-4894-8d13-39fe1488237f.png";
export const kiteR1Hin = "38b0f4bc-f11b-417a-83fc-76281a778561.png";
export const legR1Hin = "21225710-80b0-4bc2-838a-78e178218e56.png";
export const eggR1Hin = "e2d0bfa2-689b-40e6-9cc4-f47be6f8735a.png";
export const crowR1Hin = "8f61b1aa-3aeb-4923-9558-58ef61211308.png";
export const snakeR1Hin = "add5c432-7b87-49fe-81ed-4e759ff07328.png";
export const fruitR1Hin = "3a4f1519-0bee-4d63-96f7-5184b94183b3.png";
export const rubberR1Hin = "f8dba839-3f1d-48e5-9f13-a86ef1668d4a.png";
export const gamlaR1Hin = "4afc7e62-ec6e-467a-8186-1ba825b8ae00.png";
export const houseR1Hin = "0cea6cf1-dc12-4c56-ac93-1fd3a8939f55.png";
export const knifeR1Hin = "88cdf3f0-3bb5-44d7-b795-d0c5cfee5cc5.png";
export const kamalR1Hin = "749de4d3-2ca0-47d5-a49c-6f94b26302df.png";
export const TyreR1Hin = "53335a70-2aaa-4ce4-9c1b-02130f6d6e42.png";
export const chandR1Hin = "27b97375-e96f-4465-82cb-fcfbc784106b.png";
export const carR1Hin = "73e9f4ce-017b-49ee-ad2a-ea621cf303b7.png";
export const singerR1Hin = "4570786d-335f-4ed3-925b-d6da363f6b13.png";
export const cowR1Hin = "b38f619b-724d-43da-ac96-c5de8c7f5bc2.png";
export const parrotR1Hin = "54f46d87-ad18-41d5-9e58-3df0db71b308.png";
export const neckR1Hin = "57312033-c761-453c-9095-90d218fa24fa.png";
export const teethR1Hin = "9b7f58c0-f2cf-455b-921e-ae834ffe5a15.png";
export const teaR1Hin = "7d561707-d296-4e75-a280-aa83c6a57869.png";
export const fireR1Hin = "ef931be3-aa4d-4c1b-99a8-3a65504941e9.png";
export const lunchR1Hin = "8b4cbbdb-fb10-4c48-8ea2-f4a9a77431ae.png";
export const EagleR1Hin = "18e5bfb0-6cef-47de-a802-c35b6592c935.png";
export const kadhR1Hin = "d910f90b-df1d-4f42-a18c-25af02c69d72.png";
export const hockeyR1Hin = "d3d39b5b-0507-49be-9dbc-3ed38f4fd351.png";
export const oilR1Hin = "d1336777-e3a9-4e0d-a511-3959b66d9ba3.png";
export const bodyR1Hin = "fca5b1d4-a12c-4bca-80ec-e4c0088d03df.png";
export const donkeyR1Hin = "068e40b7-b1bf-4464-9ad0-398f7a6b0e25.png";
export const coffeeR1Hin = "e7d1ddf2-e969-4a24-8e76-96d11742013e.png";
export const tigerR1Hin = "7a005b3c-44c7-4bf9-8bca-fae9e6e45acf.png";
export const noseR1Hin = "c5532bc6-c53a-4fb6-a660-2a50a0e8f2a7.png";
export const ballR1Hin = "2c8bc57e-2343-4314-80ec-9508122b0dbb.png";
export const danceR1Hin = "def8886a-66ac-4a93-be4f-65aaac0110b6.png";

export const elephantR1Tam = "8c162e7a-ccdb-4cda-92f0-8d79fc4923dd.png";
export const tortoiseR1Tam = "5364c47e-6a80-40b9-912c-e88576db6ff1.png";
export const eyeR1Tam = "56d3e6c7-672a-4fe0-a89c-a7e249e20c29.png";
export const fishR1Tam = "615ed256-1727-498d-9522-97cb9d83e73d.png";
export const catR1Tam = "f16d440f-6160-462d-bdef-f2d031ef6ce1.png";
export const teethR1Tam = "bb51594e-43b0-48e8-841b-6344a97cf5aa.png";
export const parrotR1Tam = "d78b3304-c5e2-4db7-9022-a2cdbe8e074f.png";
export const moustacheR1Tam = "a12031b3-bed1-4b30-bef9-85a999709687.png";
export const cowR1Tam = "bb70cb78-9e91-47da-96bb-f5f27b0e231a.png";
export const stoneR1Tam = "50a2aea4-48b6-4c47-8c02-213a54bf74f1.png";
export const mountainR1Tam = "1d878e92-5e6f-47b1-b9db-243db89e91f8.png";
export const leafR1Tam = "5c48e3fb-1f0c-4aa6-a1ee-0926e7a039ae.png";
export const ratR1Tam = "38adbdb6-b645-48c8-9659-a137d3bf0801.png";
export const penR1Tam = "acee6797-d5b5-4102-8de4-f1f26d2a52ee.png";
export const plantR1Tam = "b0e01ab1-33cc-461e-b7f0-2a4937aa6c6d.png";
export const bellR1Tam = "69331739-38b0-4aa6-9333-c4ae379ace89.png";
export const flagR1Tam = "360cae87-bc54-4e45-ba0f-8690908de281.png";
export const swordR1Tam = "1c09ce51-dffd-48d4-890a-5dd181a82afa.png";
export const nestR1Tam = "ebb639a2-2c94-4929-ad2b-a7eed84e50be.png";
export const drinkR1Tam = "86bd4601-6672-490b-bb16-b4a36adb9196.png";
export const dosaR1Tam = "dec4d59e-2b83-43c3-b908-90ef427870bf.png";
export const henR1Tam = "dd1909f9-90fb-4da0-9416-89b8bcb8838e.png";
export const tableR1Tam = "70588efe-b800-48b7-b86e-40cb9cfdac49.png";
export const moonR1Tam = "0fe4c2ad-17fc-49b2-bce8-764a086cad47.png";
export const jarR1Tam = "5faba9e8-ca95-429a-b8e8-5c10f458fd82.png";
export const basketR1Tam = "90f7b654-3654-43dd-807e-0a04fdacf6c0.png";
export const clothR1Tam = "91bdfa61-caf8-4fb9-b320-e23e7b7ccce1.png";
export const soilR1Tam = "410aa8b7-6561-4866-9124-c6d8260e5eb8.png";
export const maleR1Tam = "3266384e-1e48-49fb-9f67-2e76b801e78a.png";
export const mosquitoR1Tam = "b81cd10e-7fe5-49a2-b7af-f017454c74ad.png";

export const eyeR1TamAudio = "1a5ed186-f052-40ed-ad3e-a820e1d4d860.mp3";
export const soilR1TamAudio = "121a1a55-6f3f-44e9-9124-71c8f7bb6edf.mp3";
export const mountainR1TamAudio = "3ff77e7a-df1f-4cfb-916f-581647cdef7b.mp3";
export const clothR1TamAudio = "31a9dc0f-addc-41a5-adb4-6eb5b980a695.mp3";
export const dosaR1TamAudio = "02fff01f-a4ef-4242-92e6-cd851d4c4052.mp3";
export const teethR1TamAudio = "c1d0e3e8-e429-4f31-99a8-b882c93a334f.mp3";
export const fishR1TamAudio = "9c1a7ba9-1a77-46f7-ab0a-99a614d0a865.mp3";
export const vadaR1TamAudio = "fd56b09f-b5fe-4ab8-ae3f-8f6f74bbb3fd.mp3";
export const stoneR1TamAudio = "53564f46-8765-4ba1-bfff-95ce1e12165a.mp3";
export const tableR1TamAudio = "823edfef-3206-42d9-8fb0-04c68f4cbbdc.mp3";
export const drinkR1TamAudio = "9e0fc37a-0533-440e-b3fd-f5230c583765.mp3";
export const ratR1TamAudio = "84cce758-4e76-44ee-8ca3-86e97007db96.mp3";
export const catR1TamAudio = "e8b2e35e-291d-4ce1-b300-f4232cac2289.mp3";
export const henR1TamAudio = "c62a820e-779d-45a5-968c-a34e1078badf.mp3";
export const nestR1TamAudio = "672635d4-e26b-49ae-a6f8-80085839a932.mp3";

export const tortoiseR1KanImage = "ac0ec0d9-e5d9-46d4-a8ee-d1ac1180e837.png";
export const milkR1KanImage = "1f5e9c26-074b-4fb6-ba06-5edeb8246af4.png";
export const treeR1KanImage = "e5ebe10e-e693-43bc-85bc-5e5445c6a2d7.png";
export const elephantR1KanImage = "4f868e0c-2083-4e54-a9bc-8efbc00853a2.png";
export const juiceR1KanImage = "253be7af-62a4-4ad6-a4fe-7c8d8875ac6b.png";
export const noseR1KanImage = "e3f79c17-364d-40df-9a08-6c671b7cae79.png";
export const mangoR1KanImage = "875bdea8-41cc-476c-b77f-b071e45075c3.png";
export const snakeR1KanImage = "2fe9ea58-bfc9-44e1-a1a9-5f75c0cffe29.png";
export const glassR1KanImage = "63805784-796e-48ad-b397-b127b1fa4b88.png";
export const leafR1KanImage = "1ab8ba13-1444-4726-9846-56d4a3fa6af4.png";
export const laughR1KanImage = "fb24a9ee-5c68-431a-a13c-f942f8da9983.png";
export const spiderR1KanImage = "db5a0a1b-a72e-4a75-b918-750361a83068.png";
export const ratR1KanImage = "b7398640-dd33-48f6-8b0b-114a3abf716b.png";
export const plantR1KanImage = "37f991f6-3ad5-4fca-8c2b-6bff2dd3e6ee.png";
export const carR1KanImage = "4fdf22f2-5cfb-4e77-b78a-33bf4bde5f21.png";
export const honybeeR1KanImage = "807cbe40-fcc9-4bd2-bba9-95fae22ae2b5.png";
export const parrotR1KanImage = "a9fd96ee-79d8-4e3f-b705-0402b45f8201.png";

export const monkeyR1KanImage = "4625d6a7-735a-44ce-827f-412a333f61f8.png";
export const lionR1KanImage = "f013bec3-01c9-47e8-8b20-2d6f0e5e43ad.png";
export const shirtR1KanImage = "bd7e3f92-4b58-47bb-bd58-3465b1db2b26.png";
export const pigR1KanImage = "0e5ca94a-7d8e-4d44-bbeb-7fa704f264dd.png";
export const legR1KanImage = "4e763f2b-a515-49ef-95f2-d5883204611c.png";
export const wolfR1KanImage = "247556cf-5dd9-4757-997a-2f594dcefeb0.png";
export const crowR1KanImage = "10ccda66-2338-488e-8dc5-103663377c43.png";
export const cloudR1KanImage = "4eee37f0-d8f7-4b4a-a29e-f63fedc1f063.png";
export const featherR1KanImage = "d3aeb3a3-f26d-455b-a062-3480021c32b4.png";
export const fanR1KanImage = "5cc5d654-e65c-4146-b5bb-be97e0623540.png";
export const jarR1KanImage = "ffc2835c-965a-493f-be65-fcb0c3da9187.png";
export const farmerR1KanImage = "8467ba2b-ed51-488c-93de-b7b2017bdc78.png";

export const cowR1KanAudio = "0ab19368-8b38-43ee-a491-b387b36b39ae.mp3";
export const treeR1KanAudio = "ed6064b3-0633-4f0d-86c8-e727afc97ac5.mp3";
export const juiceR1KanAudio = "5464ad8d-2ed0-4c10-8080-7f79e0b12aef.mp3";
export const ratR1KanAudio = "1fcf604f-d3ad-4590-b1c7-6cb4f3fe541b.mp3";
export const featherR1KanAudio = "34364eea-958a-41cd-9e93-3d3d01d7494e.mp3";
export const laughR1KanAudio = "b10e8d4a-aa96-4101-ba63-35b063c3b90a.mp3";
export const fanR1KanAudio = "0a6b4183-e7fe-4a11-800e-5c91dfc14aa1.mp3";
export const pigR1KanAudio = "effae238-56b9-4911-9b2c-237f2749ed91.mp3";
export const leafR1KanAudio = "b9670659-2ec4-4314-8f5b-9eb545d1eef3.mp3";
export const spiderR1KanAudio = "c7c1d0d9-c90b-409d-b339-95d47772678b.mp3";
export const carR1KanAudio = "cfe8d1d0-ee8b-4a9c-b0be-7d06a277153f.mp3";
export const legR1KanAudio = "11c6f659-769f-41f3-9973-2db7ccd02134.mp3";
export const parrotR1KanAudio = "d2fa3703-cf3e-4e9f-b6c3-de7b10d6cfdc.mp3";
export const farmerR1KanAudio = "01523c73-f192-4cf6-b6fe-4aa95ad1bfc8.mp3";
export const lionR1KanAudio = "e6a4d353-9e21-4a17-84d8-60cc71dee1ec.mp3";

export const mouthR1Tel = "0f1b413d-de3e-4f2c-ab24-108d77dc7d25.png";
export const autorickshawR1Tel = "21e838c0-0156-4475-86ec-6a7aef3f8c7d.png";
export const necklaceR1Tel = "9822ea4c-f708-4f4e-9284-d4bcc1e2b71d.png";
export const mugR1Tel = "ed24184c-b299-4bf7-a9c9-6da45747f3db.png";
export const duckR1Tel = "95c7587b-9b73-4ca1-b08a-14f497af62ed.png";
export const footR1Tel = "e36b0b47-8a19-4ba3-a428-65318e9536cc.png";
export const lockR1Tel = "2320398c-a82b-46ae-82a0-c43cb1518d55.png";
export const cheethaR1Tel = "03deffbf-8260-40cf-93ef-33d25bfaa7e7.png";
export const antR1Tel = "a695346b-59bc-479c-848e-f403254d206d.png";
export const featherR1Tel = "fb02e020-cb19-44de-bf2c-b519495cff05.png";
export const potR1Tel = "5c13ec90-3d0a-4018-a216-095758e7de35.png";
export const neemR1Tel = "bd1bac1f-ad53-45e0-af4f-cc77810fae99.png";
export const schoolR1Tel = "3351517a-fbf4-4dc7-9e0f-94e0b453cc5a.png";
export const shoeR1Tel = "6f3d514b-0c93-4fa6-9c0f-a3912fcfc7ae.png";
export const ballR1Tel = "21f94637-01d8-4d51-abda-8fd8cdb93f40.png";
export const shipR1Tel = "28f8dfbd-6497-49f8-84cb-0295b8cab87c.png";
export const tigerR1Tel = "cc962375-c1d2-4919-9751-bf2caa83bbbd.png";
export const juiceR1Tel = "30cfdd21-dbb3-4904-b9df-fdc3afac5b97.png";
export const milkR1Tel = "c8793b30-b0e5-4e71-a1a7-4742e0b4b343.png";
export const swimR1Tel = "6bd1b93a-88db-4dfd-b6b5-b3d850189433.png";
export const neckR1Tel = "e3d86f29-3af2-4667-96b2-09910a3748a6.png";
export const swingR1Tel = "4a25be6b-f007-45b1-a8b4-a252170a900a.png";
export const moustacheR1Tel = "a7119684-87f4-4905-a81b-0a2611192f6d.png";
export const monkeyR1Tel = "5a8a64bf-6cb7-44b3-8612-a525309c9d12.png";
export const swanR1Tel = "a50653b2-465a-4a9d-85a1-eabee8bd58c2.png";
export const penR1Tel = "adcd14c0-157b-4e30-9bf9-cfd274992c0d.png";
export const waterR1Tel = "23966700-485f-44d9-a71b-1ee2435e3cac.png";
export const leafR1Tel = "3a5b7507-4e23-4eda-89e8-6927c8e6a4be.png";
export const fruitR1Tel = "bcafcd4f-9be0-4dc0-afc9-2bd0b30d0f40.png";
export const snakeR1Tel = "283a88c3-18b5-4d36-98f6-efcafa573cf4.png";

export const mouthR1TelAudio = "1aa9ad2c-f837-429e-8bec-9d4c64e2be88.mp3";
export const waterR1TelAudio = "e7a2e5c0-a736-472f-94ae-6aa8abbb51a4.mp3";
export const monkeyR1TelAudio = "5294a43b-6bae-4713-b225-7269a8eff341.mp3";
export const moustacheR1TelAudio = "37ac7b47-50da-4bff-bdf1-62cab00a0193.mp3";
export const autorickshawR1TelAudio =
  "e2cfea88-c090-43a9-ba5f-68fc3b5b15ec.mp3";
export const snakeR1TelAudio = "fbeff296-6401-4249-9133-0356529480dd.mp3";
export const antR1TelAudio = "ef6d93f1-77c1-462b-a1e3-79f1a1d33cf0.mp3";
export const mugR1TelAudio = "2b4f2392-3d06-4034-8969-be1a8cc48a4f.mp3";
export const cheetahR1TelAudio = "45463cc6-02fe-4275-97ea-3fd787fbeeac.mp3";
export const shoeR1TelAudio = "b191d8f3-f8f7-4a8b-8398-d373782d4099.mp3";
export const footR1TelAudio = "fbfe13c2-03e0-42dc-b552-d2e35611edf3.mp3";
export const necklaceR1TelAudio = "7ecbfbb0-2b39-4d3e-b85a-ae11e8bbb0e5.mp3";
export const tigerR1TelAudio = "755c56a8-db17-4ca7-9c58-5dd7146c925c.mp3";
export const lockR1TelAudio = "72a1ec2a-9a76-4530-a7fd-7d9150cbb618.mp3";
export const swingR1TelAudio = "3fc5e886-a5af-4520-b8fc-4c1c94a56010.mp3";

export const foilR2 = "aefc3ad2-76ce-44b2-86b8-f75c4429a829.png";
export const footR2 = "5ca0959c-0c0f-4da3-83ea-b7da1ac767f2.png";
export const bothR2 = "5ceb7244-f9af-4622-9a51-66c3223088dd.png";
export const toysR2 = "57a55557-e179-4b5f-9974-82ee878ad37b.png";
export const crownR2 = "8add8005-7b43-4b97-9a5f-6f27be6ae481.png";
export const childR2 = "8eb4567f-8781-4966-99f3-a2676d268ad5.png";
export const thinkR2 = "2565acd5-028a-4fcb-8769-51afc9446ecd.png";
export const soilR2 = "3fd03649-bf6a-498c-9fda-cecc42151d0b.png";
export const sourR2 = "22794d3d-a57d-48e0-ad93-a9a5aebd07c3.png";
export const matchR2 = "81edb8f3-3610-455c-9a0d-17f2ca78d05b.png";
export const cubeR2 = "2f316989-fd90-4734-b83b-a0efa8b76243.png";
export const lookR2 = "7c21d897-dec1-422f-8bc6-0c525ab9eb20.png";
export const fullR2 = "2b734b4a-6057-4a03-b9c1-64630f4bec38.png";
export const chewR2 = "39eb1f45-b01a-495d-9ab8-c88397fc633a.png";
export const aloudR2 = "dc7ace47-d5b2-408a-8599-806996b43967.png";
export const cowR2 = "12ee96c1-cfbb-4e8a-89f3-f69f40701257.png";
export const woodR2 = "420390a9-6e10-44bb-b2f6-b3e2a10e076d.png";
export const chopR2 = "5c33df13-5be4-4543-9266-9eb5a271e209.png";
export const togetherR2 = "e5d1d748-aa55-44b9-bac0-fb29ab627cb0.png";
export const yearR2 = "31553b6c-3330-4ebf-b62b-c6bbc92f20c7.png";
export const reuseR2 = "552ba164-f180-4ebe-865a-63f34dd32f10.png";
export const valuesR2 = "35013aa9-6711-4f73-88a9-6205bacc0c34.png";
export const boyR2 = "7dca4a5f-319f-4800-b525-e5c8926d72e3.png";
export const timee = "f218b5fe-57a4-42d3-81a4-efea884c8a0b.png";
export const nowR2 = "f2689a7a-cb18-473b-85ae-18e2ca611ffb.png";
export const goodR2 = "bd9ff108-4f1d-4c93-b4b2-afc883ce4d58.png";
export const booksR2 = "616997a6-201f-4d0b-a511-929d6cd00871.png";
export const withR2 = "770d008f-15de-46e2-9f89-ea68d88de13f.png";
export const woodenR2 = "53943a16-cb25-48c9-83b0-44a136387499.png";
export const joyR2 = "27a843ee-fe46-4719-945c-07eded5bdf55.png";
export const choiceR2 = "b511a455-6a12-4ab4-9f25-453f7ede196d.png";
export const roofR2 = "084a8d25-34c1-4b5d-a30e-64dc9b401c01.png";
export const woolR2 = "69264e81-0c93-41a1-9763-37bfd193eaea.png";
export const cowsR2 = "2ce3c4d2-a539-47ea-8bb8-e6b89752f28f.png";
export const enjoyR2 = "32ef13a5-e0e7-431c-a0e5-f46e554234d8.png";
export const owlR2 = "eaf789b7-f0ae-45f2-8f03-d58f485ab404.png";
export const loudR2 = "e3c573ff-f851-4212-b67b-dd3e8d6dac2b.png";
export const youngR2 = "bc4e76a9-9c65-4012-83f2-876d892549cf.png";
export const watchR2 = "96e2ab89-1c30-4f26-ac23-a81c94d8ba26.png";
export const thinR2 = "9faf896b-0c6d-4540-b331-33d7dfaabcf7.png";
export const outR2 = "68fb3ecf-cefe-43cb-b431-f8e91235c171.png";
export const cloudR2 = "9e5dad83-4dfe-4947-a753-3649e31bca5f.png";
export const hugeR2 = "77344df1-030c-43f1-8e50-6dc03dadb526.png";
export const boilR2 = "d0fc8d64-60e2-4ab8-9bfb-9215e41c32ec.png";
export const chartR2 = "69604c1b-9a9e-46d4-bc1b-2546c4dee973.png";
export const richR2 = "3bd8a129-96f1-4a63-9dcc-0b0188b40ed4.png";
export const fewR2 = "29f9eb38-03c3-46f5-aead-c43a4c966a13.png";
export const yellowR2 = "e1930c1b-7ecb-45a6-9e41-43cc46147abc.png";
export const cookR2 = "f1bcb5a4-252e-454a-ba7a-96197abf7a94.png";
export const yawnR2 = "c06e866c-3885-4148-828e-012ce900f175.png";
export const youR2 = "beec7354-3e22-4452-91ac-f4f4e7e92ba0.png";

export const loudR2Eng = "a9a1bebc-3079-42f7-b4a0-b06cf896445b.mp3";
export const boyR2Eng = "49ca6af8-a6ad-4a26-ae54-ca16ba67bb78.mp3";
export const toysR2Eng = "5e0fef99-adeb-4da9-9620-6ff8a6e6c69f.mp3";
export const soilR2Eng = "248d7ef4-f053-44ee-a9be-1cb5afba7a31.mp3";
export const cowR2Eng = "f502ea9e-407c-4c92-99f6-09e8fdbc7eaa.mp3";
export const booksR2Eng = "1b8f65c6-d8cd-4267-bcfa-3a5f1272e6dc.mp3";
export const woodR2Eng = "b312f9f7-781a-4538-aef8-56f441a31a53.mp3";
export const footR2Eng = "b77259ef-1523-48a8-8891-cba1bf13cc90.mp3";
export const watchR2Eng = "9f15530f-5ec4-4b34-9805-8dc14cfd9d6d.mp3";
export const owlR2Eng = "68f1afae-62d7-4520-99ba-525cb0e8606d.mp3";
export const fullR2Eng = "a90465cf-5de7-4a23-8f37-67075b353b5f.mp3";
export const cookR2Eng = "be8daab6-67f0-456b-9e97-d56e8da4356f.mp3";
export const boilR2Eng = "1c88af40-9957-440a-999e-c711de338082.mp3";
export const yawnR2Eng = "fdfa16d0-2e81-4a30-a5bd-57f25c296054.mp3";
export const foilR2Eng = "512072f1-c7db-4447-887b-fd25ec1b2dd0.mp3";

export const karelaR2Hin = "2dd48cc3-9c50-4c20-b61c-c6074b5ce90b.png";
export const papitaR2Hin = "a7f71485-84e4-4ca0-a353-652b4da1bd72.png";
export const manabR2Hin = "a848c4a7-2353-41c4-8d29-2898e39e583e.png";
export const kitabR2Hin = "86d132aa-0ca0-4e22-aa62-bbc999eb6704.png";
export const kisanR2Hin = "0a182515-9a8f-4db0-89f3-c58e10044792.png";
export const hridayR2Hin = "2a60a5c2-a76d-4dfe-a8e3-77837c21d8c1.png";
export const morniR2Hin = "340216fb-9172-4c0c-ac81-5b7b4e46a61b.png";
export const khajoorR2Hin = "5d50f638-69b0-449e-802d-333b8725bfd3.png";
export const badamR2Hin = "d7f55e89-b70f-4159-8fab-1b5abe5756d8.png";
export const daudnaR2Hin = "c931df87-3f7b-4e0f-8870-46f08d0ac53a.png";
export const baiganR2Hin = "a385f5ef-c23f-4906-894f-1e20fe7f7223.png";
export const mahilaR2Hin = "841a130a-dda4-4a7c-a036-c83ab6bbf4ff.png";
export const rupyaR2Hin = "ef505732-0470-4b68-8261-11a157187d8c.png";
export const dholakR2Hin = "9c33d8a7-097f-4b00-83aa-6c467940c7bb.png";
export const idliR2Hin = "28334ca9-843c-4191-a3a3-05f19f95c4bc.png";
export const jharnaR2Hin = "62984a0d-a45c-44f6-83ac-c072f73c073d.png";
export const anghutaR2Hin = "504332a5-2458-4796-bd54-e96589b53473.png";
export const ladkaR2Hin = "00e71eac-5e69-4890-b9b0-18584519986d.png";
export const machisR2Hin = "da8d2ee4-89d0-4cc0-b0c3-93b95923097f.png";
export const policeR2Hin = "6e7fa7aa-2a24-4f1b-b771-83967971fb44.png";
export const mithaiR2Hin = "9a36a1bd-1c24-4e7c-a405-d42a7ddb8fd8.png";
export const nahanaR2Hin = "07956be8-4a7f-41c2-a89c-01e1df29c250.png";
export const ungliR2Hin = "c559909c-63d5-4a86-8e53-6e31f449701d.png";
export const makdiR2Hin = "eb086572-3a0f-4079-a44f-b7f416161459.png";
export const mendakR2Hin = "244da428-2a92-42ea-a1ad-438949d2dbb8.png";
export const bagulaR2Hin = "70ff512e-efe2-4a93-878d-87aa47bd863c.png";
export const dawaiR2Hin = "e8250223-c11b-4e21-bf33-b49aae2287ae.png";
export const suarR2Hin = "2eea2dce-d416-4fae-ae7b-8a67e1a5320e.png";
export const tarajuR2Hin = "6f29d5bc-a9a5-438b-a134-6ac69b8294ec.png";
export const ghoslaR2Hin = "e4159ba3-06e3-4433-8432-039668eb531b.png";

export const manavR2HinAud = "f4b6c228-8426-4b84-90e7-5bc461a1faf8.mp3";
export const dholakR2HinAud = "5dddfdef-91f5-447d-bc1f-9d7b9dfde671.mp3";
export const ladkaR2HinAud = "861eed0b-69e2-4849-8ad7-06baad235a74.mp3";
export const hridayR2HinAud = "cd0bd553-fa2d-49b9-b2a4-5003fcc27fec.mp3";
export const bainganR2HinAud = "a123d8da-39fe-4eaa-b50f-e90e4a90e967.mp3";
export const jharnaR2HinAud = "6505b08f-a802-4784-b6f3-c7fb0868f354.mp3";
export const machisR2HinAud = "66d6da49-28c6-49b0-ad5e-8fb6c64d53bf.mp3";
export const makdiR2HinAud = "ccbf996c-d75e-44bb-a07a-8111878412c3.mp3";
export const kisanR2HinAud = "1ac5f7dc-6903-4d4a-b62a-c6dbcc468ced.mp3";
export const idliR2HinAud = "fc72cf94-a94e-44e2-8c69-16898bc2b932.mp3";
export const rupyaR2HinAud = "2414eeef-a9fd-4dd1-81cb-4606c1615832.mp3";
export const dawaiR2HinAud = "7c33ae19-b547-423d-9db8-42958d0a2fbe.mp3";
export const tarazuR2HinAud = "22e04e9b-1f1b-49c8-b176-fb98bb624921.mp3";
export const kitabR2HinAud = "4398f57e-57a6-41f5-9e31-9108893d1188.mp3";
export const karelaR2HinAud = "ca07135f-8c97-4feb-bb86-ecb40496ad9c.mp3";

export const bearR2TamI = "b8337bd9-f7a3-42c5-b32f-d35cd1bdc2e3.png";
export const boatR2TamI = "11f1ad72-04d1-46ab-bf48-16eccd492d35.png";
export const birdR2TamI = "35d00e30-2c0b-4248-b88b-d6db4aed163e.png";
export const humanR2TamI = "4dde2088-f78e-4974-aa4d-1901ecb624d3.png";
export const tabalaR2TamI = "458d2713-cc0e-4b35-bf2f-149576c846d6.png";
export const ringR2TamI = "d130eba0-0e7a-47de-87ab-b55b95722c4a.png";
export const chilliR2TamI = "8905bc9c-d805-4543-be03-4b52546814d9.png";
export const slowR2TamI = "3be773c1-0df4-4caa-88b6-8d1d37594772.png";
export const hotR2TamI = "55d373ab-3f3d-4393-a747-0a869c40af7b.png";
export const donkeyR2TamI = "7a4062bd-c4cc-460f-b388-dd01a00ec9e6.png";
export const danceR2TamI = "88098535-3864-42d8-a516-3662250e221a.png";
export const fruitR2TamI = "9c61945e-a6b1-4e50-9e19-5cf413ae6b2b.png";
export const sunR2TamI = "70e61cd3-ff8a-4385-81e6-316006c02ca9.png";
export const oldR2TamI = "f85aa04e-2ff8-45c5-b1c1-c824a57c21d3.png";
export const frogR2TamI = "72dd5a19-8fb9-44b6-b0d6-32e8a4e242e3.png";

export const humanR2Tam = "99a8537d-486d-45e2-9dfb-8f5c1f4d482a.mp3";
export const frogR2Tam = "80a15371-f2c2-419e-9398-4fa894974e08.mp3";
export const oldR2Tam = "088c23fa-e18c-4b63-b048-df1ae86c3e05.mp3";
export const donkeyR2Tam = "1c14d32b-2245-423b-a57e-fda57c0e4964.mp3";
export const sunR2Tam = "3d62d3cb-53c3-42d6-a1df-4638d3c3c042.mp3";
export const boatR2Tam = "27226f66-6bf6-4e82-b6ea-06b276dcef35.mp3";
export const ringR2Tam = "2f1cb97b-881a-472c-88bb-0404adc612f2.mp3";
export const bearR2Tam = "c89531a2-0711-4531-bcfd-5ec532b12a2b.mp3";
export const fruitR2Tam = "bd82c929-561b-4f46-98e7-0a34072401c5.mp3";
export const slowR2Tam = "72515c81-5c72-4c28-a1ba-ade7ed5fffb5.mp3";
export const tabalaR2Tam = "a09f5fba-ff5c-4448-81e9-74c003b5e917.mp3";
export const hotR2Tam = "a37be1e6-5b97-430a-8c4c-a818c41ef528.mp3";
export const chilliR2Tam = "77d0e6e2-d49a-41af-8ebd-06a1cece62f3.mp3";
export const birdR2Tam = "e6550a37-7df1-4a9d-8f18-340b6b8a0498.mp3";
export const danceR2Tam = "15325aad-cfca-4aab-a1b9-5c8251b5a3f5.mp3";
export const eagleR2Tam = "12414acd-d597-43e0-b6cd-f61a9e066459.mp3";
export const computerR2Tam = "b6f9487d-2ce8-41ba-bf54-a993d2b217f2.mp3";
export const lipR2Tam = "b1aff71c-104d-460c-8da0-89ed40132758.mp3";
export const earthR2Tam = "0c4630bb-b8fc-44da-a417-029fd0975570.mp3";
export const farmerR2Tam = "14732853-a3f4-45e6-8c8a-47fb4596c7f4.mp3";
export const featherR2Tam = "c36eb6e0-18af-4efe-ae75-0fb155268e3b.mp3";
export const pillowR2Tam = "c9207b78-8567-4341-af35-7788cdde4607.mp3";
export const kingR2Tam = "8b612f2f-152e-43a7-86ac-1a9e030cfc0a.mp3";
export const prayR2Tam = "80708886-1aa0-4ebc-8a4b-38226fc47df5.mp3";
export const respectR2Tam = "643d5ea6-ed0b-4100-81e3-72b355758563.mp3";

export const batR2KanI = "fc11b046-43b6-4a36-b154-80f64e77e940.png";
export const flagR2KanI = "49e2fc03-8a0a-4618-a735-c592066ced79.png";
//export const authorR2KanI = "b96663a4-f3f1-412e-b517-8c5d49040f99.png";
export const heartR2KanI = "32da18ac-2e1b-4420-8f25-33b106f7f59d.png";
export const medicineR2KanI = "df43f4f5-8754-4ede-b48d-d46c7b77b809.png";
export const PeacockR2KanI = "cbb9cca4-6127-4601-878b-6638770037b9.png";
export const familyR2KanI = "e936cafd-a6f8-4f14-93d0-e2fba4c4f4d0.png";
export const squirrelR2KanI = "ed3ab40e-324b-42a3-8e0f-265243342b60.png";
export const humanR2KanI = "903f1729-a73b-4d52-aa57-1f54ada461ad.png";
export const antR2KanI = "37428626-5ed7-4f4b-b76b-5236e1cd3761.png";
export const flightR2KanI = "5f5e44f2-fc49-4f8d-b3ea-98d403cb5888.png";
export const fingerR2KanI = "4fc8a923-ff85-4f7b-a5a4-00309f6854a4.png";
export const mushroomR2KanI = "9f1222ef-2872-4651-9e0b-5b15e7d05d4b.png";
export const roseR2KanI = "1631e92b-9606-4ad0-ad61-8335eee4e5ff.png";
export const potterR2KanI = "512e9e51-d456-400f-b24f-9538e93fe407.png";

export const heartR2Kan = "5ab31ac8-8254-46c9-b24b-2eadb292c157.mp3";
export const potterR2Kan = "9b531f60-d46a-4b6b-9e56-41a92392e62b.mp3";
export const familyR2Kan = "b6402897-eeb7-4fe3-af10-d965b8ceb832.mp3";
export const flightR2Kan = "7cb3dcd3-9c98-4958-a439-3ca1dbce19e2.mp3";
export const humanR2Kan = "81ad753e-ab68-4c13-a198-0480d58097fa.mp3";
export const antR2Kan = "e71d21bb-993f-4e2d-986a-6347e74f8499.mp3";
export const authorR2Kan = "738b3c09-7d35-4292-b475-e85e0ff5a388.mp3";
export const batR2Kan = "8e65b053-9406-4a53-afcf-60943cfa35d5.mp3";
export const roseR2Kan = "9eb48eef-a245-4ea3-ad1f-e804e86e7057.mp3";
export const squirrelR2Kan = "ea437a10-31b9-4c14-9b92-3b9549384b69.mp3";
export const medicineR2Kan = "48efa14c-574e-4105-9c62-3923eb232873.mp3";
export const peacockR2Kan = "7733fd83-0d9a-4fca-bfa7-beb98f716c4c.mp3";
export const fingerR2Kan = "21ba80a8-ed7e-42a6-9635-eaa734588df8.mp3";
export const flagR2Kan = "9123c598-fff4-4d39-aae1-e3fda7c9a8ac.mp3";
export const mushroomR2Kan = "ebfc35ec-f048-4be0-a55c-aa7334e720fc.mp3";
export const girlR2Kan = "78ec7b47-60c9-470c-ba11-185c9c78203b.mp3";
export const towerR2Kan = "bcadb2da-5fec-4330-941e-88969001b1d9.mp3";
export const cheetahR2Kan = "e70cfbc0-bda7-4462-b06e-016c4004a60d.mp3";
export const bearR2Kan = "d614a927-2e66-46b2-b6bd-2ec8fa429b80.mp3";
export const bucketR2Kan = "da86ccc6-6a40-4e41-ade4-3cd4ac907f8b.mp3";
export const fluteR2Kan = "2ddea481-1720-4bc0-93ca-262fa7a6061d.mp3";
export const rangoliR2Kan = "9ca0d5c2-c813-4743-813e-d2f601edfc2c.mp3";
export const aeroplaneR2Kan = "37a79c56-6f59-4953-85f3-9a9e6c61db9a.mp3";
export const agricultureR2Kan = "a1122d56-af9b-4eed-9dd3-f618f630f996.mp3";
export const vehicleR2Kan = "72a3db29-217f-4f07-972e-f8083dff4efb.mp3";

export const aeroplaneR2TelI = "6caf99ec-216c-45fe-aa84-f1255b96b4e8.png";
export const brainR2TelI = "4cfd67b7-65d0-425d-9ac5-3789b71a79f1.png";
export const rabbitR2TelI = "e361987a-3bbd-47b8-9dfa-ab47ee3714cc.png";
export const windowR2TelI = "02ef5604-7ab3-462b-aee1-e02385d3bd80.png";
export const brinjalR2TelI = "b0648159-fde4-417e-929b-0a1062733836.png";
export const elephantR2TelI = "8dd32711-3f45-4507-bc87-6314f19097c5.png";
export const crocodileR2TelI = "f6fb8169-1ad7-4ae8-afb8-8b4d63e683ae.png";
export const cycleR2TelI = "3af29a85-abe4-45e5-bdd2-f2267a99481d.png";
export const animalR2TelI = "994907e3-aeee-4934-bfda-1135197683b0.png";
export const bearR2TelI = "d2c3561c-932e-4adb-8d28-4e36e3ef1bda.png";
export const appleR2TelI = "9add8e44-b0a4-4d54-a4e0-c12a1f6650b6.png";
export const pigeonR2TelI = "799fa446-61ee-4684-9694-dcdfdc38cd90.png";
export const tomatoR2TelI = "d2f10b98-ae9a-4ff2-83fd-e8f017a57285.png";
export const peacockR2TelI = "04ef036e-0548-46a6-aeda-fdd9bcc2a8ab.png";
export const heartR2TelI = "0b40915a-a55b-4e27-bc65-bf48f25c9e9f.png";

export const appleR2Tel = "9d9c8502-34b6-4580-b5f0-492ddea47038.mp3";
export const brainR2Tel = "1e8efe29-e89a-4854-8e5a-f315019abe10.mp3";
export const elephantR2Tel = "4e6a15d3-ddea-4a53-9af7-6bd5b51f9bb5.mp3";
export const windowR2Tel = "68ad6c01-912f-422a-ab67-41ad3147c333.mp3";
//export const bearR2Tel = "0a7cbfa7-64a8-444d-b927-d2d1d2d4a128.mp3";
export const brinjalR2Tel = "949fbecd-a81b-4d95-be24-56da9a0e5021.mp3";
export const pigeonR2Tel = "e3f9dd79-3fe3-4e68-827b-1f6791bcf1fb.mp3";
export const crocodileR2Tel = "9224eb29-9864-44b8-9dc6-737db951555c.mp3";
export const tomatoR2Tel = "7d72d658-e5a4-4145-9094-b90bfb35da6e.mp3";
export const heartR2Tel = "cc040936-6efe-41a9-a757-6ef294ae2552.mp3";
export const peacockR2Tel = "98ad3044-003f-4b99-ab7b-99b59e8235c9.mp3";
export const animalR2Tel = "0d533cc2-56ee-463d-b928-5ba742c84dce.mp3";
export const rabbitR2Tel = "33e01489-1e3a-4070-8248-ae0b6508f6db.mp3";
export const cycleR2Tel = "6152528e-5a0b-441f-8fa2-8c14fe563b97.mp3";
export const aeroplaneR2Tel = "3e02d6ae-8d73-4d2f-8631-06cefd379652.mp3";
export const mangoR2Tel = "5e1f2c17-829f-4db7-bd51-a475be0a37b6.mp3";
export const giraffeR2Tel = "e3d0e4e6-3526-4de5-92d9-172f80bb697b.mp3";
export const policemanR2Tel = "ab081155-db1b-4b57-8d88-08ae4eb70138.mp3";
export const sweetsR2Tel = "30ea52af-8400-4480-811e-b560c07a5a5f.mp3";
export const pineappleR2Tel = "e836ab15-7a65-49c4-b27d-380969f5da6c.mp3";
export const boilR2Tel = "8076cb27-4a9c-4429-8c35-b3f0f79517c4.mp3";
export const familyR2Tel = "1a920667-bd73-4d37-ad15-59af1ae42ac3.mp3";
export const hibiscusR2Tel = "0f89721e-75ba-456c-a0d7-905719cac46c.mp3";
export const chapathiR2Tel = "2d29f66a-3273-46c1-a21c-bddd8b064ef7.mp3";
export const umbrellaR2Tel = "5254d658-ba62-4277-968f-94cbd2f388d4.mp3";

//M3Hindi

export const peechaakarnaM3Hin = "eb4e206a-59a2-46bc-86f8-5f75ca87439e.png";
export const soochiitkarnaM3Hin = "c2bbca12-de73-425b-acc8-2e9d37265ec3.png";
export const pakadlenaaM3Hin = "9572afe2-8527-4b5b-b624-7529b1ee5065.png";
export const chotlagnaaM3Hin = "df3a618d-c72c-4394-8adf-f3d07fdb0c1a.png";
export const aananndkarnaM3Hin = "8cda76d3-2d2e-4488-bbcc-903332580e9a.png";
export const paashucharanaM3Hin = "0c493633-7c61-43e5-a4f5-4de2deecb61b.png";
export const gaaramkarnaM3Hin = "dac3ef71-5739-4c66-abe3-e6fa13854046.png";
export const paarichaykarnaM3Hin = "f5e9e80d-2f8b-4850-a95c-3e4a37cfdcc9.png";
export const baandkarnaM3Hin = "0643b084-f749-401b-97b3-98818b1a5d15.png";
export const gaoonkamandirM3Hin = "55d4250c-5715-4cbf-99bb-1a23e342fbce.png";
export const khelkasamaayM3Hin = "a03dfffc-cec5-42f5-9c7f-7ac2afd45dcc.png";
export const gaapshapM3Hin = "de378224-6a86-4f39-8d28-bdcc68ac4a05.png";
export const meleekamajaM3Hin = "ae807e8d-ccb0-422f-8635-bb9c8303f27b.png";
export const heybhagwanM3Hin = "df2a53c2-adaf-4312-b5f7-c65a99514aaa.png";
export const badibehaanM3Hin = "8c96672d-ee50-4050-9d76-d78cea7c550a.png";
export const vaajankarnaM3Hin = "b201c522-c873-4e33-9bc3-221a7d37e471.png";
export const kanghiikarnaM3Hin = "b52e32ca-d641-42d5-907c-a49242898745.png";
//export const chalookhelenM3Hin = "e01e2f33-4b09-46bb-8fad-211dd8b12d69.png";
export const bhaagleenaM3Hin = "52f22791-0438-436e-a0ec-1cd9bf5a1a2c.png";
export const mootorgaadiM3Hin = "1d0a199e-bf78-4078-ab94-53c6cc623a58.png";

export const gapshapM3Hin = "73eb0878-400c-4974-b28e-008df02553d1.mp3";
export const garamkarnaM3Hin = "aa10643c-46f9-4151-8a86-c21bb0010f86.mp3";
export const vajankarnaM3Hin = "ad77a100-3040-4ca9-be42-093df5db35fb.mp3";
export const bandkarnaM3Hin = "cdcdb0b6-6d02-4f6c-8240-8551a9b899eb.mp3";
export const chotlagnaM3Hin = "c6ed5a5b-98b3-4394-980c-b3c3e871ab91.mp3";
export const aanandkarnaM3Hin = "e6b81ce1-877d-4fb7-9edd-2418a5a55293.mp3";
export const peechakarnaM3Hin = "9cbf7c9d-c47c-4a6b-ac62-35291e56251b.mp3";
export const parichaykarnaM3Hin = "9246bb34-4262-4dee-b868-f64375b90b11.mp3";
export const pashucharanaM3Hin = "3f742fba-8195-4843-82f7-3f381363646b.mp3";
export const motorgaadiM3Hin = "0a653f23-dfa2-46dc-b91b-7cd3d5016a53.mp3";
export const khelkasamayM3Hin = "9c324c13-6129-4e28-91fe-c29575457fdd.mp3";
export const bhaaglenaM3Hin = "47455e8d-dd5b-4733-ba9f-4f28423f87b0.mp3";
export const pakadlenaM3Hin = "008700c4-c04b-485d-9794-a1a2eea0d40a.mp3";
export const gaonkamandirM3Hin = "a4c3cb12-2e8b-4bad-bd83-1ec856891f15.mp3";
export const badibehanM3Hin = "d831aee8-7583-4d17-80f3-fcda9837a0df.mp3";
export const hebhagwanM3Hin = "5a57e311-964f-4742-83e3-3fbb3f0e4fc3.mp3";
export const soochitkarnaM3Hin = "e8cbae27-49e1-4e50-aadd-d911ef57c846.mp3";
export const melekamajaM3Hin = "6d721245-3ff3-4c94-9d70-70f07b3b90b0.mp3";
export const chalokhelenM3Hin = "aaf97211-6d53-4415-9055-c50daacae6ad.mp3";
export const kanghikarnaM3Hin = "ce520a08-bf9e-433c-861b-21eaf5202e0a.mp3";
export const khetmeinkaamM3Hin = "bcb51d94-5fb1-4d2a-a0d3-d3943fc2d86a.mp3";
export const chhotabhaiM3Hin = "2dbf77b5-df09-4f33-898d-39c5443de3f0.mp3";
export const niraashhonaM3Hin = "2d04df46-2d09-484b-9d37-dae01a218059.mp3";
export const taalibajanaM3Hin = "ce6e6c31-383f-4047-afcd-7b3b2bb77800.mp3";
export const gaonkatalabM3Hin = "6cb78e9a-f839-4e7b-a4f2-cd43212bc7e5.mp3";
export const bazaarkadinM3Hin = "66bf1d1c-101f-43c7-9aee-45aa547d2f15.mp3";
export const jhaadulaganaM3Hin = "7d952abb-3e0b-4157-a0ed-f31dd1f8d96d.mp3";
export const hawaijahajM3Hin = "dee3fced-ad9c-45c7-ba55-966b5f730d6a.mp3";
export const khelkamaidanM3Hin = "7c8d8f75-c4f8-4905-8af5-46c389400ca4.mp3";
export const jadugarkakhelM3Hin = "09ab7ac5-735f-41ee-842a-9070e3907454.mp3";
export const shaharkabageechaM3Hin = "927b1371-bc1f-43e0-acc9-5779a38398f8.mp3";
export const khetonkisairM3Hin = "3d8f53f6-9558-4336-b220-c0f2628796a0.mp3";
export const ikathhakarnaM3Hin = "b2972f7e-61c4-4367-baae-4f701f8e03c4.mp3";
export const hawaiaddaM3Hin = "2c21b287-9af2-4878-a0b0-3edb1623dd5a.mp3";
export const autorickshawM3Hin = "6babbb92-aac3-40f5-b98f-7b3fbd0d5fa4.mp3";
export const shayankakshM3Hin = "7bd29586-afc2-4588-a88a-e8dce3ee3c33.mp3";
export const brushkarnaM3Hin = "096ec6dd-7d05-4c13-b2bc-8295c9762ed1.mp3";
export const machiskidibbiM3Hin = "11bebd21-d029-4fcd-a92f-f80fb710874f.mp3";
export const lohekabaksaM3Hin = "9c425c3e-0b26-4b37-a513-79b95f756bdf.mp3";
export const badonkopranamM3Hin = "af6bf374-5d17-460c-ae24-0e588d38feab.mp3";
export const aadhiraatM3Hin = "931857f8-d60b-478d-ab89-c5cd909f1107.mp3";
export const udaaskarnaM3Hin = "1151846e-9ddf-4ee5-8139-01c46064bf69.mp3";
export const sookhjanaM3Hin = "6d8616b8-55d3-478f-baaa-b4b531753c66.mp3";
export const taiyarkarnaM3Hin = "73bcdc3b-28b0-466e-ba85-a51076968e65.mp3";
export const kitnebajehainM3Hin = "609747c3-f0a5-4300-897b-b6b1a3cad5e0.mp3";
export const chidiyachhotihaiM3Hin = "e34d5767-7e5f-4366-b4ea-cd4e339fecc1.mp3";
export const prateekshakarnaM3Hin = "66038050-87ce-4bf7-b0c0-8275ec2db3b6.mp3";
export const tumharamitraM3Hin = "914f8b9d-42b3-479a-8fd2-b419d6439728.mp3";
export const schoolkichhuttiM3Hin = "b931af04-4293-4698-b335-6dc7c5664599.mp3";
export const aashirvaaddenaM3Hin = "2ec81870-04a5-4c5d-b557-adb454715dd7.mp3";

//M3Tamil

export const thecamelisnearthewolfM3Tam =
  "834d78f2-def7-4ef7-835b-314ee3934d5b.png";
export const nothinghereM3Tam = "b6c42676-4af2-477f-8bce-8d89e8c7cd65.png";
export const glassbowlM3Tam = "9d5971e9-b1f9-4bd4-b1f7-1195a45884cf.png";
export const greenbeanM3Tam = "38f8553d-1f72-4a72-81da-0ebfa17861a4.png";
export const letsrundanceandsingM3Tam =
  "bd04a667-dc09-4292-8e67-aa9b4f67e2c6.png";
export const readingisagoodthingM3Tam =
  "1da8cd23-7aa7-4a4e-bab4-8e3f2e81cf79.png";
export const brothersphoneinhandM3Tam =
  "caf2f3e4-a98d-4287-8b71-f3e85aeaa9bf.png";
export const letsplayontheswingM3Tam =
  "37c1f1e9-9f12-4353-bbcc-0e20ec60b590.png";
export const makegheericeM3Tam = "1f5ed7a8-56a4-43f0-82b5-2f01438d3577.png";
export const hedrovefastM3Tam = "ff7d9bf0-03d7-4309-a804-73aa6c062acb.png";
export const flowerfruitforestM3Tam =
  "3a140c0d-0c0d-4407-9cd1-328810edb856.png";
export const steelswordM3Tam = "20299d60-5cc1-4bed-87e6-5cff6640d4e6.png";
export const eyesoilM3Tam = "d066515f-a8fc-4193-a707-9604a6bc2552.png";
export const eatwithpleasureM3Tam = "af3d7eb4-e7ec-4374-b140-3d0735cdd5ba.png";
export const aboatstandingontheshoreM3Tam =
  "28abb40b-4225-4509-b34c-63ae53918d97.png";
export const putriceontheleafM3Tam = "d8403fa7-6494-4c21-bdce-ab4850d5f3b9.png";
export const hepickedthefruitsM3Tam =
  "53c10cc2-76d2-402f-bca9-5a9fed272761.png";
export const holdwaterM3Tam = "c7ccdd8d-4da5-490d-96a6-1faeecb97137.png";
export const turtleswimingintheriverM3Tam =
  "86fb2014-5dea-4225-993a-47e6cbaf7124.png";
export const momcomehereM3Tam = "90f4cdc1-b6bb-44ce-891f-053cadfc4b6b.png";

export const hepickedthefruitsM3TamAudio =
  "d577de68-fb15-41f2-8390-0c201c929750.mp3";
export const readingisagoodthingM3TamAudio =
  "8cbad023-1c82-4aa8-81fe-5aeba3a9151c.mp3";
export const eyesoilM3TamAudio = "d17115b4-cd26-4521-8c50-9df009d804d2.mp3";
export const turtleswimingintheriverM3TamAudio =
  "f405b251-267c-4d12-98a9-c7fa4602382c.mp3";
export const eatwithpleasureM3TamAudio =
  "776495ff-4488-4269-90ca-6ce4aeaac85f.mp3";
export const nothinghereM3TamAudio = "d69f5402-712d-42bd-a914-cfb35b1a41e4.mp3";
export const flowerfruitforestM3TamAudio =
  "e3cc46a2-7d36-4702-880d-3bb4b2c90028.mp3";
export const momcomehereM3TamAudio = "eb1af888-96e0-40c2-a7ad-9b89ec1ddd7e.mp3";
export const greenbeanM3TamAudio = "87cbb2f5-7147-42e1-8687-f8dc6e7106ba.mp3";
export const holdwaterM3TamAudio = "62477f82-2a97-488b-a48b-19ccfbb8da18.mp3";
export const putriceontheleafM3TamAudio =
  "6c8cbbf9-3964-45a3-839a-df5eaa2b3a02.mp3";
export const brothersphoneinhandM3TamAudio =
  "a31d195e-f41d-4651-a168-6134fac82be7.mp3";
export const letsplayontheswingM3TamAudio =
  "1083f658-9a8f-418f-8d74-b15cac7ecf28.mp3";
export const letsrundanceandsingM3TamAudio =
  "a1247c5a-0eaa-467f-9b0a-4b07d0801ec6.mp3";
export const aboatstandingontheshoreM3TamAudio =
  "6963458f-993c-4a9c-bc77-38a23311d7ef.mp3";
export const glassbowlM3TamAudio = "ea95e4b3-d742-410e-bc08-38d01191b919.mp3";
export const hedrovefastM3TamAudio = "a91ece80-eb4e-4f19-a238-9f376dcd90d0.mp3";
export const steelswordM3TamAudio = "386892f7-0711-4d23-ad71-befd278bff17.mp3";
export const makegheericeM3TamAudio =
  "945265ba-31b7-448b-92c0-c791fdbd22ee.mp3";

//M3Telugu

export const songlistenM3Tel = "7d673a30-f2fb-4c9a-9e35-5ee8f4e16b4b.png";
export const stripespalateM3Tel = "378ff1c9-eda7-4bdb-9bb6-eaefcbe9edb1.png";
export const thisismosqueM3Tel = "214b3ce3-a2a4-41d7-9931-a200fa5b04a5.png";
export const intheskytherearestarsM3Tel =
  "d991bed5-4a31-4037-a2a8-76deed164cff.png";
export const dearjumpedM3Tel = "34790972-ef40-4878-82ee-dff3abc83d13.png";
export const withbrickswallM3Tel = "f764fa11-a8dd-41ee-8368-f98a7d1bbe09.png";
export const lionroarsM3Tel = "61b92a59-2b6d-44e8-8d43-00a266eceb59.png";
export const aantM3Tel = "5a8cd554-8b17-4633-9853-58e590cadf55.png";
export const twogoatsM3Tel = "61f3a5e7-10b8-4e7c-9385-8a221c6bc37f.png";
export const chilipowderM3Tel = "2c9d80f7-2220-4a59-aa84-fe9859cd076f.png";
export const peacockfeatherM3Tel = "f4a18e14-7b58-4141-808b-7b2af0393b46.png";
export const birdsflyingM3Tel = "b58258e7-cf75-4824-937c-9b7ad4f51de8.png";
export const mustacheuncleM3Tel = "0a9ab754-09c7-46ad-8145-22b2333b2eca.png";
export const diamondringM3Tel = "79ea42ab-27c3-47da-aced-ce532cfcbc5e.png";
export const thisearthwormM3Tel = "75573a2f-6b0b-4625-aa99-8c7f5b1a331d.png";
export const stubbornrockM3Tel = "d029437d-7289-4e70-80f3-a133ff8f897c.png";
export const dentistM3Tel = "70110e5a-e86b-4a1e-92a9-7881eaebb1a4.png";
export const tothegametablaM3Tel = "b96ac3b5-b845-46f7-90fe-e9eb8cdd07b0.png";
export const babyplayedM3Tel = "96379f24-3c26-47fd-9d9d-cf6a6af30961.png";
export const elephanttailM3Tel = "8d8f1fe4-1fe0-4a9a-a4d8-41dbfca3b8bb.png";

export const babyplayedM3TelAudio = "dce8d2ae-72d3-4eec-b2f8-6801c185f9b5.mp3";
export const peacockfeatherM3TelAudio =
  "c463cafc-ff0f-4d3a-a109-f3a7ab7bb2f1.mp3";
export const intheskytherearestarsM3TelAudio =
  "5c2bfd07-9369-4716-9936-f9fa989f464d.mp3";
export const elephanttailM3TelAudio =
  "38b32371-e203-4762-afe8-5e0ca646880e.mp3";
export const twogoatsM3TelAudio = "c2809eb3-32b0-4ab5-ab9c-89b6cd20f038.mp3";
export const aantM3TelAudio = "a4f65da6-e5b9-4408-a5e6-30fcf5728cd8.mp3";
export const thisismosqueM3TelAudio =
  "aa0e2715-167d-42db-9c02-ddd1beaf9cba.mp3";
export const withbrickswallM3TelAudio =
  "83de9e64-bf27-429b-b5f4-69919f8ae971.mp3";
export const mustacheuncleM3TelAudio =
  "12f3817c-4956-4348-b1fc-c88018f1fb7f.mp3";
export const thisearthwormM3TelAudio =
  "1504ee8b-c60f-4218-925f-ed90ffac1673.mp3";
export const diamondringM3TelAudio = "de9b3848-902e-4427-ace5-934cf83e2782.mp3";
export const stubbornrockM3TelAudio =
  "555dfe7a-1907-4c39-a54b-2f133bab48c6.mp3";
export const chilipowderM3TelAudio = "5730c191-51af-4578-b10c-2a77bddc0956.mp3";
export const birdsflyingM3TelAudio = "31dce04c-e861-4d02-872f-6469d6e862a2.mp3";
export const lionroarsM3TelAudio = "c2fa3327-c18b-47f0-b390-471d0a65bd38.mp3";
export const stripespalateM3TelAudio =
  "bd437d1b-680d-4563-add6-4ef72e65ee03.mp3";
export const dearjumpedM3TelAudio = "d2b78328-ee78-4f8e-a163-d0cc5ef24905.mp3";
export const dentistM3TelAudio = "522b3c7c-043e-48bd-9f33-66b197ee4fe4.mp3";
export const songlistenM3TelAudio = "a618b710-4be5-4d3b-bb67-6434e7f0f5c6.mp3";
export const tothegametablaM3TelAudio =
  "54583c7e-03d9-46be-9899-bfac0190b1f2.mp3";

//M3Kannada

export const elephantstailM3Kan = "64c0366b-0cb4-4a34-a78f-ca1ef3e3cf3c.png";
export const treesinthewoodM3Kan = "c4e4136c-b2a0-4ad5-a25e-6e99382fdbfc.png";
export const thatisatempleM3Kan = "57e5adaa-6126-4832-94d8-af9d144dc877.png";
export const marigoldflowerM3Kan = "81d9e9cd-26d5-4e7b-b0b9-e5c64b058fcd.png";
export const listentothesongM3Kan = "dad1977d-fd5e-4b02-9668-df2e6a754e0c.png";
export const beautifulnecklaceM3Kan =
  "dea31bfb-e212-4408-8325-0f0f5d704640.png";
export const indiacountryM3Kan = "d349afc6-540b-46ba-a896-ab0d50372546.png";
export const mangotreeM3Kan = "60eefe7d-dac7-48ee-b5da-a1ff101a8636.png";
export const sunriseM3Kan = "aaf228c7-8263-43b3-acf4-80a25d437469.png";
export const theglasscupM3Kan = "7a52728f-9175-42db-acd8-86980bd75765.png";
export const moonraisedM3Kan = "f8842a1d-82a1-485a-9a08-969ae87c50eb.png";
export const fillthewaterM3Kan = "08c2d082-46f5-4ad3-aa6c-baa4bf019be2.png";
export const closethewindowM3Kan = "3ae27cf0-df3d-4116-b857-348d7b5578ea.png";
export const khokhogameM3Kan = "2fb4c122-4a91-44b7-a0aa-8b1b6185b80b.png";
export const thisisamosqueM3Kan = "4ff75192-be61-484e-b8ff-a51097fab289.png";
export const twogoatsM3Kan = "1c51756a-889b-422a-b935-a00d99ea6fc4.png";
export const friendstalkingM3Kan = "d608a59c-f8bc-4cad-ab56-0400990d849e.png";
export const thetreeiswitheredM3Kan =
  "24492921-f460-40eb-9bcd-8f0669487c3c.png";
export const thisisudayahomeM3Kan = "20b978ac-2695-4f71-9d30-2bbf57e8cd4a.png";
export const crispyvadaM3Kan = "6cdddf16-4c01-4c8e-a0c4-e4212bf143ad.png";

export const crispyVadaM3KanAudio = "113dba60-cbe9-445c-ae9a-7729d1da65bb.mp3";
export const mangoTreeM3KanAudio = "e445ec44-bc58-4aa8-a7b0-df7d34c3e1ab.mp3";
export const elephantsTailM3KanAudio =
  "99c6f7be-8bba-418a-b0be-3eeeee19f1ff.mp3";
export const twoGoatsM3KanAudio = "e8b11fa0-124e-4a23-8a04-4e839ecb414e.mp3";
export const fillTheWaterM3KanAudio =
  "02362240-5f4d-4ba0-b77e-b9f0ddad5d00.mp3";
export const thisIsUdaysHomeM3KanAudio =
  "45472397-b830-4145-8a41-606c793eadb4.mp3";
export const theTreeIsWitheredM3KanAudio =
  "4f58d935-8937-494d-b5ea-bf98857c1f5b.mp3";
export const thisIsMosqueM3KanAudio =
  "108973a6-c194-4878-96d1-7f4b8efabcf9.mp3";
export const theGlassCupM3KanAudio = "255db28b-f6bb-4571-97e7-13ed869965c7.mp3";
export const marigoldFlowerM3KanAudio =
  "9b5fa14c-31cb-4627-b32d-aa55b395233f.mp3";
export const friendsTalkingM3KanAudio =
  "6fb57199-dc0b-463c-8751-f663cd973d69.mp3";
export const indiaCountryM3KanAudio =
  "b7ed65cd-f817-4215-b8b8-b7311480977c.mp3";
export const khoKhoGameM3KanAudio = "9a1e5846-1484-4e99-8f9c-f2b1921ba1f0.mp3";
export const thatIsATempleM3KanAudio =
  "648199bb-a5bb-49a7-9f39-1b82923fbdaf.mp3";
export const treesInTheWoodM3KanAudio =
  "0ca8da2a-dde4-495c-aaeb-5270b2d3cd26.mp3";
export const beautifulNecklaceM3KanAudio =
  "9876484f-5ac0-4775-8d5d-7b19afecd1f6.mp3";
export const sunriseM3KanAudio = "fc81e500-c5a4-41bc-88af-c452a132941f.mp3";
export const listenToTheSongM3KanAudio =
  "277e89d2-ca69-4e8f-9b27-29779b6f7ffb.mp3";
export const moonRaisedM3KanAudio = "eea0c560-b163-4339-b8c9-9e2918b40712.mp3";
export const closeTheWindowM3KanAudio =
  "34229200-0489-4950-b723-fc2cb9878796.mp3";
// export const level10S2Announcement = "dbc0f212-b68a-4b61-b3b9-25cf11cd092b.mp3";

//M3EngAudio

export const sheSings = "0c5740d3-0597-4174-9511-663ee425ed7b.mp3";
export const heDances = "dcb4ecad-5657-4e36-ba41-24c0a112d7bc.mp3";
export const weWin = "96ecda94-c3a4-49a5-af25-83977512a03b.mp3";
export const iDream = "68962340-c1b0-49b9-9fb4-d20959fce56e.mp3";
export const iSleep = "381edc58-23be-49c9-8767-b11336f9c618.mp3";
export const heEats = "16da35c6-dddc-4a1b-b9e7-a665dd82bf05.mp3";
export const weTalks = "2d170853-40c6-4516-b9fc-119d4b9dfa64.mp3";
export const theyLaugh = "62af30f8-f79f-40c9-992f-7630326b1fcc.mp3";
export const heListens = "9711a5a6-8fa2-4f80-b1ca-bfee7130f298.mp3";
export const sheReads = "b24d8831-c354-46a7-8756-8db99e07040c.mp3";
export const iRun = "42073cfa-f445-47c8-9376-2b015bc8ed07.mp3";
export const wePlay = "4e4a915d-826c-4527-ac96-8b5ccfcc6279.mp3";
export const youCook = "12fed714-5e46-4d83-9ad2-26853aa95b68.mp3";
export const birdsFly = "79ae8ab9-61a7-414a-be37-0cb9d6cc1dff.mp3";
export const sheSmiles = "5b632b71-864b-4dcb-9fe9-c0ea99a01d3a.mp3";
export const theyJump = "34cbafc4-32ed-4393-a8ea-1b713e7a8872.mp3";
export const youLearn = "0f984e64-d6e6-414c-9623-13c07f8f1b46.mp3";
export const itRains = "f0aedde3-58b9-4c70-becc-9f52fa88ac3a.mp3";
export const weWalk = "4bf8af93-5c88-4552-b6c0-48fd4163348a.mp3";
export const youSwim = "aee23dbd-1117-4659-a545-6c2ec4264983.mp3";

//M3TamilAudio

export const wetsoilM3Tam = "dc8e1f35-51dc-475e-9b84-eb0e5b2776f5.mp3";
export const poorhealthM3Tam = "129c31db-3a63-4d9f-a115-574f6e9ecf16.mp3";
export const adeliciousmealM3Tam = "9f0ff022-0860-45f7-9b88-4297989dc2fa.mp3";
export const hedrankmilkM3Tam = "cd993f1e-8445-4ecb-95d5-f1384bd6d5f9.mp3";
export const shepickedflowersM3Tam = "203a5c62-6e8f-49d8-9dba-4303b7e0ce08.mp3";
export const thedogisbarkingM3Tam = "ca592740-418c-4a67-8a55-e374e054c0d2.mp3";
export const thankyoufriendM3Tam = "0bdbecc1-90a2-4ff3-ae9b-be49deead2e7.mp3";
export const iamcomingM3Tam = "f0499194-83d1-4bd6-8e6a-b27e374ca4bd.mp3";
export const thefrogcameM3Tam = "1adc6c77-9f53-49fe-942a-1a2535415cdc.mp3";
export const adonkeycameM3Tam = "947529f1-d8f2-4847-bf32-bd547f08064c.mp3";
export const gheedosaM3Tam = "0872340a-4e4b-479b-bdae-2810f4a937b2.mp3";
export const hedrankwaterM3Tam = "993dc1b4-38d8-43e8-933c-c3d367924fc8.mp3";
export const elephantroarsM3Tam = "026ae0bd-9f52-4b44-b141-16221bc9cb7c.mp3";
export const hegaveittothepoorM3Tam =
  "c20602e7-f014-41d4-b469-c2a6097216a4.mp3";
export const singingasongM3Tam = "aa0f9dd1-4281-4488-b962-dd7c7f577802.mp3";
export const theturtlecameM3Tam = "a7f4dafe-4e73-411f-a8b4-7756397a67d7.mp3";
export const thewormcameM3Tam = "c8a658f1-86d2-4993-9f4a-5bf0cfa31893.mp3";
export const likeapearlM3Tam = "70d62a46-1980-4b14-bd22-1d05fc593fd2.mp3";
export const honeybeeM3Tam = "59d0e6e7-4878-49cb-9382-8c1d19621cb7.mp3";
export const thewheelisspinningM3Tam =
  "bc5ab525-0542-4420-90d2-945897dd8c59.mp3";

export const kingsCrown = "14ec298b-1f5d-47bb-956f-e936b265ace8.mp3";
export const coriander = "fcb319da-70dd-4a3e-aa5e-3cb4d4d11746.mp3";
export const thatIsEarthworm = "9aeccc80-b2c9-49b4-9026-92743f63bb51.mp3";
export const bedRoom = "79fef7e4-dcb0-4511-9d07-2a1eb5ef5678.mp3";
export const theDustbin = "9dd00716-7c08-4c59-9854-0cd3a76f22ff.mp3";
export const dogIsRunning1 = "d8d97cb5-7c82-45af-92f1-c2145ffc3da1.mp3";
export const turtleSwims = "625a0a13-75f8-4e32-b5ae-8e9a82f7e190.mp3";
export const dogIsRunning2 = "246edded-1afe-458c-b25a-f4fbcc36235c.mp3";
export const aFountainPen = "684c90b0-da8f-41c6-8e03-86105433a18f.mp3";
export const airport = "312fa66c-99ca-4728-bbde-7f9c9b83fa04.mp3";
export const monkeysTail = "1dfb18d9-a159-4668-92d2-051534d4d1c5.mp3";
export const fiveBangles = "873a7cb4-2ec0-40a7-b378-3c605f091bde.mp3";
export const kamalaIsSwimming = "cb8ef0ee-fdd4-4311-9c66-5bf1317d7bae.mp3";
export const tigerCameTiger = "8f5a4671-e0b1-4149-ae56-379c7d7a351f.mp3";
export const stoneFingerRing = "4ae22f9a-c45b-40f9-8c70-6a9d72757234.mp3";
export const starsInTheSky = "aec0c8dd-43ab-4af4-b14a-28ed9aeab605.mp3";
export const flowerArcade = "8cf2c666-598f-4783-93fe-03efde7f6c13.mp3";
export const blueSky = "a75066b0-d8b7-4445-ae99-8378993db716.mp3";
export const petalsOfAFlower = "180dcd53-a68c-4cd8-9217-4997c6d30f52.mp3";
export const kingsPalace = "f4ce9b86-84c7-499f-b12a-4459fc2897e2.mp3";

export const yellowFlower = "f67cda88-5991-4c85-a1ae-fcccd7216c65.mp3";
export const eatingRice = "f4fee2ec-fc70-4507-abdd-22aad80ce9af.mp3";
export const birdsMadeNest = "34bb9bc7-8a92-4b08-ae66-4553de03219c.mp3";
export const greenGrass = "e4b8df3d-65ab-4e32-a3ba-bd024f677ded.mp3";
export const beautifulHouse = "941668fa-a9e4-4586-beb0-28d8de7f872c.mp3";
export const mustacheGrandfather = "bb1776a5-cdde-4cc7-9ca5-303319324169.mp3";
export const mangoTree = "a089003d-e5b4-4da1-b7a1-6a702c16060a.mp3";
export const youThink = "0b891a8d-8f7a-4527-8804-21a9be817c69.mp3";
export const forestTrees = "b24f66c1-1f2b-4d95-b07e-019b856b51a6.mp3";
export const ironingBox = "750655f3-51bb-4b19-8461-6410174c4b66.mp3";
export const blueSaree = "9f48c2b4-6c1a-442d-bc15-a6e7bd1fbeea.mp3";
export const runningTookIt = "e52cf157-080b-49b7-850f-6c06bccb8475.mp3";
export const glassCup = "60388cc9-2479-4370-862c-ce4ef8945c1d.mp3";
export const rangoliPutIt = "4e8d41a8-1152-4659-90fa-5a212d583353.mp3";
export const makingKite = "09739407-719a-4020-a86f-9ac6df48d216.mp3";
export const garbagePot = "f4c2583e-d48e-4b60-b228-5d8d29334a83.mp3";
export const thatPapaya = "d9a9288e-a3c2-4a80-92f9-2e794257b89a.mp3";
export const headCombing = "031eaa06-dd4b-4218-80ec-300535aebb90.mp3";
export const redTomato = "c58268e3-6d50-491e-b351-f1c81d51ba4f.mp3";
export const tigerHereItComes = "f66eb453-8ae9-4c0b-85a2-3eb7e5046881.mp3";

// Level 14 - P1
export const level14P1OneSAudio = "53ad96b3-7475-4017-a0fc-396a15f9888a.mp3";
export const level14P1TwoSAudio = "3e8c8622-8c85-4fe3-86db-83a301fade69.mp3";
export const level14P1ThreeSAudio = "af04db67-e7da-4f3f-9d71-975f4a7af1f5.mp3";
export const level14P1FourSAudio = "3960e679-c320-4f94-9a8e-cae5de680f52.mp3";
export const level14P1FiveSAudio = "73864524-20ba-4f8a-accc-39baf942e5cf.mp3";

// Level 14 - P2
export const level14P2OneSAudio = "c600eb86-acfc-4e83-829c-4bf04f4f9066.mp3";
export const level14P2TwoSAudio = "eaac3289-ba63-4c96-9037-39ee8c31b999.mp3";
export const level14P2ThreeSAudio = "bda01f8c-5301-49da-b8c5-994aa41de80d.mp3";
export const level14P2FourSAudio = "9fcf9f44-aad2-44b1-96de-5246ffcc625d.mp3";
export const level14P2FiveSAudio = "0a6a3db3-0b5e-4660-ad3b-6aeeeac5452e.mp3";

// Level 14 - P3
export const level14P3OneSAudio = "b3363562-d1b2-4697-8572-4a10fa1fd0da.mp3";
export const level14P3TwoSAudio = "1d2c9d34-57fa-439b-a21e-785ccf431e47.mp3";
export const level14P3ThreeSAudio = "d6d710a7-f00c-4851-94ef-f22038af48ab.mp3";
export const level14P3FourSAudio = "e547a695-6289-4656-8557-77116024a367.mp3";
export const level14P3FiveSAudio = "2253c56a-dd4e-4e94-8859-618e8a1f11f3.mp3";

// Level 14 - P4
export const level14P4OneSAudio = "c261f131-b207-417b-b7bd-ec1245a3b857.mp3";
export const level14P4TwoSAudio = "51b7db9a-67cf-4a6d-8594-93dc8ed5ded7.mp3";
export const level14P4ThreeSAudio = "27150ae9-b3e5-4911-bec8-7510e1f3e7e3.mp3";
export const level14P4FourSAudio = "8f155f94-626f-495b-b80d-eb5b701db0b6.mp3";
export const level14P4FiveSAudio = "2b4e02a0-36fc-4a36-aa40-182333af0b03.mp3";

// Level 14 - P5
export const level14P5OneSAudio = "cefbcdb2-da19-4e99-8738-0974a92aef36.mp3";
export const level14P5TwoSAudio = "4dd262e2-2d44-44e1-b4d3-95870b90ec86.mp3";
export const level14P5ThreeSAudio = "1ca0dca5-c5a0-4b31-9ce4-23d1fb572e5f.mp3";
export const level14P5FourSAudio = "dc8148aa-d65e-4335-90a0-80bde00c4de2.mp3";
export const level14P5FiveSAudio = "7e0d37b5-3b0a-407e-ba66-6d8c0777da35.mp3";

// Level 14 - P6
export const level14P6OneSAudio = "dcea8ca6-f4f6-4eca-9ea7-9bb0283e0ea9.mp3";
export const level14P6TwoSAudio = "829f21af-0915-4f4c-8fb7-785ca61f8a36.mp3";
export const level14P6ThreeSAudio = "9e8aeb43-be8c-47b7-aa3c-8bb06bcf57f7.mp3";
export const level14P6FourSAudio = "78ba1f4b-902d-4de5-bab3-c56c16293f56.mp3";
export const level14P6FiveSAudio = "eeff71fc-06f4-43e7-ac55-41f39c15a080.mp3";

// Level 14 - P7
export const level14P7OneSAudio = "8f089236-1a52-48a0-b237-2b03c1dd8094.mp3";
export const level14P7TwoSAudio = "51933141-3444-472b-8e9c-bf4866d54219.mp3";
export const level14P7ThreeSAudio = "f962416f-ddb1-47b8-8a0e-2a6b4b517adb.mp3";
export const level14P7FourSAudio = "7be14006-0e47-495a-8bd6-5fe18f4c8759.mp3";
export const level14P7FiveSAudio = "cb7d9c6a-34ad-49eb-bdc7-1e17e95c82e1.mp3";

// Level 14 - P8
export const level14P8OneSAudio = "984cec90-fe02-4c5d-943f-b601ff0e3306.mp3";
export const level14P8TwoSAudio = "3a86f346-bbce-4ee9-8922-7f6236e5a456.mp3";
export const level14P8ThreeSAudio = "857d3861-276a-498f-9e50-29e91d0c3f1a.mp3";
export const level14P8FourSAudio = "a88955a6-86a4-4f43-9d98-86c6e50fdf35.mp3";
export const level14P8FiveSAudio = "7a54107c-5a10-4d73-925d-15fd77cfce97.mp3";

// Level 14 - S1
export const level14S1OneSAudio = "fe3cb918-9984-4bcd-a740-c8b36db6042b.mp3";
export const level14S1TwoSAudio = "1c5bc250-daab-4dab-9b8a-0912cfccb95f.mp3";
export const level14S1ThreeSAudio = "096f3c8a-8e80-4669-91b0-610b86cc02c8.mp3";
export const level14S1FourSAudio = "a83ca95c-3e0a-4c5b-a787-44bd516a967d.mp3";
export const level14S1FiveSAudio = "cfd7e0e0-3ea2-49ff-bc0b-12d0b28dd9a0.mp3";

// Level 14 - S2
export const level14S2OneSAudio = "a51cf4bb-6fa5-4613-8f1b-ee2ce8e73c13.mp3";
export const level14S2TwoSAudio = "520a55f5-5e3f-4cf1-bf7f-44046f035599.mp3";
export const level14S2ThreeSAudio = "e2a2e6a2-b351-4fee-a8d9-6665a8bc5f7d.mp3";
export const level14S2FourSAudio = "5ed9c0d2-ae67-4755-8b1f-a90fdf899ac0.mp3";
export const level14S2FiveSAudio = "339db950-3d91-4b78-918c-4c0c4603c989.mp3";

// Level 15 - S1
export const level15S1OneSAudio = "f5058193-6b29-43b8-a496-6995efcaee0b.mp3";
export const level15S1TwoSAudio = "bfaa95b8-548b-48d3-b0c3-21a653eeb5fc.mp3";
export const level15S1ThreeSAudio = "747e2d21-cddb-4e8a-80f1-6d1544bd353b.mp3";
export const level15S1FourSAudio = "608fb238-e733-4cc2-92f2-7bfaef680354.mp3";
export const level15S1FiveSAudio = "5afa50f5-3529-4e46-83f3-6af829a6de15.mp3";

// Level 15 - P5
export const level15P5OneSAudio = "947315d1-9589-4c4e-8c83-8df4c1da08f8.mp3";
export const level15P5TwoSAudio = "0bc56aab-e586-49a5-a2ba-8deb99391703.mp3";
export const level15P5ThreeSAudio = "ab73aa6b-6b40-4f6b-9dcf-01aa074803d7.mp3";
export const level15P5FourSAudio = "fd91529b-6ade-4551-9fa2-1035db79d269.mp3";
export const level15P5FiveSAudio = "26b5d031-504a-456b-8809-1f616ecac613.mp3";

// Level 15 - P6
export const level15P6OneSAudio = "15856e68-dec0-43c9-8a1d-55eb5c9d8bcd.mp3";
export const level15P6TwoSAudio = "179d4ada-ce48-4982-aac0-06ef942837e4.mp3";
export const level15P6ThreeSAudio = "b649a5d9-4d8e-450f-aaf9-c7ce909e92f5.mp3";
export const level15P6FourSAudio = "caa663f3-a6e4-4b19-ad5b-6e2d97edf2bb.mp3";
export const level15P6FiveSAudio = "261e173a-ad2b-4243-b284-26a33ac84bfa.mp3";

export const sarbatM2Hin = "c226797a-0e2f-4d84-8401-b16fefb12e3d.png";
export const teacherR1Hin = "e62e9b45-3bf9-4f66-949c-ae648601ea75.png";
export const chalookhelenM3Hin = "9325a35f-2881-4935-98dc-a0cb765a234b.png";

export const authorR2KanI = "8a270288-cf22-4def-8f26-d2d09ef4239c.png";
export const umbrellaM1Kan = "7848e977-281e-49d9-b633-7390a18822cb.png";
export const bedroomM3Kan = "68db623b-e2bd-4d89-8704-491cab8b08d6.png";
export const flowerR1Kan = "12c86317-4df8-4231-8bdb-bff51d735b7d.png";

export const spindleM1Kan = "207a7af9-952b-46a2-837e-832706012af5.png";
export const swimM1Kan = "51c0027a-09d9-423f-b746-ab36fba9533f.png";
export const peopleM1Kan = "96a4b9b9-c2f0-4e66-bfe3-38ceca5632a2.png";
export const sixM1Kan = "1e70030a-1350-4459-8c29-a51b9d963bbf.png";
export const fiveM1Kan = "e92b7127-23fa-4c6e-988f-c527f937ff71.png";
export const necklaceM1KanImg = "7e07cffc-c838-48f2-b7db-7d6b899f2a34.png";
export const runM1Kan = "f45e74b5-9b10-46f2-b895-891166d4196e.png";
export const lockM1Kan = "34592aff-1d8a-46e8-b028-9cc0deb4f071.png";
export const cotM1KanImg = "c45bbe86-cb08-4800-ab93-679862ae2637.png";
export const oneM1Kan = "eef8b85a-e9a3-4259-adef-0f9a795164af.png";

export const mathematics2M1SylKan = "b9deee88-d6f5-4598-af29-a0db5419fc77.mp3";
export const rotiM2Kan = "016db371-d7b8-476c-9214-ae3cb510e5d7.mp3";
export const angerM1Kan = "d5e63ee5-42c9-43ca-ad76-69d202e1e464.mp3";
export const spoonM1Kan = "9ff68da8-eeaf-4a4e-81ed-7afa1fb70662.mp3";

export const necklaceM1KanAudio = "80fc616c-4932-4786-9e10-2eb921ff29ad.mp3";
export const cotM1KanAudio = "7875eae5-8a56-449d-9171-a3372a5a3917.mp3";

// English - M1/M2
export const cameraM1Eng = "1b8720ae-0dd4-47d3-863b-6a26103f59c7.mp3";
export const camM1Eng = "8300d1a5-6bc2-4c8a-8378-d32620c79fd5.mp3";
export const erM1Eng = "0cb18875-6acc-4eac-bfb9-d54ad10e2018.mp3";
export const aM1Eng = "45ca98d1-4f97-4b56-81ab-c814e695a458.mp3";
export const cherryM2Eng = "2e3181ca-373e-4be2-b3ec-e6cb15ecf420.mp3";
export const chocolateM2Eng = "55e8724a-7d96-42a3-9022-3aa972eeedb3.mp3";
export const musicM2Eng = "420d894e-b31c-4d9e-ab2e-bf46b0af7db7.mp3";

// Telugu - R2
export const bearR2Tel = "d2536436-c8d0-4e9c-ada6-bb2a2181449c.mp3";

// Hindi - M1/M2
export const bandarM1Hin = "5432f0f2-f38d-48c8-a27a-67750679222c.mp3";
export const sarbatM2HinAudio = "fddac7e2-2842-4eb8-ba42-c221cb9f4e3f.mp3";

// Kannada - M1/M2/R1/R2/M3
export const lotusM1Kan = "ef40aaf6-4f6d-4039-bda2-189f5c58835b.mp3";
export const necklaceR1Kan = "4d2a2364-07e1-4259-99d0-4823bac68789.mp3";
export const bedroomM3KanAudio = "2f60e9f4-a0e4-4eef-a36c-4f06e95925ef.mp3";
export const fountainpenM3Kan = "aead4cd8-e34f-4af1-a7d9-1c252ad0303f.mp3";
export const necklaceM2KanAudio = "b2c6d7d3-e6e9-48d8-af46-b4b4f644899f.mp3";
export const cucumberM2Kan = "e8574f14-2e96-4da1-87b4-273721d1b6e9.mp3";
export const chocolateM2Kan = "2e27b63e-8d93-4e2c-ab3f-d0142c2c8a51.mp3";
export const flowerM1KanAudio = "eeab957e-6391-45c6-a1ce-919b15db5476.mp3";
export const raviM2Kan = "570efe0e-38f3-474c-bdf7-5c1a811b874c.mp3";
export const umbrellaM1KanAudio = "fe801adf-c10f-4c43-bd42-eb727a723a83.mp3";

export const sixM1KanA = "5a744c58-7d5e-4880-9da8-e068317138b2.mp3";
export const oneM1KanA = "03894238-46a3-4950-b871-cfedcfd38b6b.mp3";

export const lockM1KanA = "b1439fc5-d568-4ec4-b8fa-65d6365d4a99.mp3";
export const runM1KanA = "f994b6bc-e591-4437-a167-904d09caee81.mp3";
export const swimM1KanA = "11a6b467-1e47-4798-9f07-83006af7ff63.mp3";
export const spindleM1KanA = "4ba1362d-837b-48d3-850a-1e6e3e3d4441.mp3";
export const peopleM1KanA = "acd82a52-c0d3-4645-8bd1-29277bb46332.mp3";

export const fiveM1KanA = "b50343da-a1d8-47a2-8e99-d5e20aae8609.mp3";

export const cabbageM1KanI = "e8cf4a57-be3d-41e4-99dc-2debd2f68796.png";
export const flowerRImg = "e4160d27-920a-444a-b84e-566d82d2e3cf.png";
export const therousterHenM3Kan = "eaa208e5-0b57-4d61-986a-21c69ba5c792.png";
export const coffeeM1KanI = "8ab3beee-cf72-4f02-af81-d39b62ed16a6.png";
export const cowR1KanImage = "6bea46f9-6958-4d0a-bd96-615fd81259f4.png";

export const Anger2Kan = "17fd48d3-9e41-4b4d-8372-dc4cb7ca55ec.mp3";
export const cot2Kan = "818742a9-1057-4996-afef-73d443b4cc54.mp3";
export const throwedballKan = "db19d120-cde0-4471-928c-883717e008c5.mp3";
export const whoolKan = "24b5389c-c034-44cc-96cc-7b83320c544b.mp3";
export const anger1Kan = "ee8ca0bc-e31a-40ee-8dc9-4e95330ce067.mp3";
export const cot1Kan = "314e6013-4250-4c6e-8e94-6c0ba9beac3b.mp3";
export const lemonKan = "1586b6dc-4c92-4461-a74d-ee2776d7fbcc.mp3";
export const Chocolate2Kan = "6a274ab1-8ee4-41b6-b9a0-03bc29cd299e.mp3";
export const FountainPenKan = "00f00b14-83dd-431f-9ef7-d0ab59505135.mp3";
export const bearKan = "d87399e0-6cd2-433c-8001-5b387c7bc669.mp3";
export const KiteKan = "466e0377-eefa-4c80-a946-fe878082784e.mp3";
export const juiceKan = "bdd05b15-8f3e-45b1-a532-dc20cc8a4dc0.mp3";
export const umbrellaKan = "bf46e876-1f0d-4844-8a06-180cf2cc77a8.mp3";
export const Cat1Kan = "bd168594-a131-400f-8dc1-88cb64cb4b5d.mp3";
export const scorpionKan = "c0cf43bf-04d5-48f3-a159-94b98d2409f7.mp3";
export const greenleavesKan = "aeef410d-a354-4acd-a8b4-99fcb12923ba.mp3";
export const umbrella2Kan = "08d4b6a9-526a-476e-af2c-4e0d2455cc15.mp3";
export const scorpion1Kan = "455ee79f-c60e-432e-b2fd-33096c88c817.mp3";
export const meal2Kan = "e0cd3900-c739-476c-ae59-2b0d587b104e.mp3";
export const BoyKan = "34300bbc-30d5-4914-8717-c625e6fe3b68.mp3";
export const Cat2Kan = "d1860c02-ba4e-4ec9-8267-12d4ce0b529d.mp3";
export const ChocolateKan = "c3e48bf7-72da-4dcb-bb07-aceefaa47d48.mp3";
export const wheat2Kan = "efb94cc1-dc1b-4626-9bd4-d801dab6dfe0.mp3";
export const scorpion2Kan = "678f9204-7edb-4544-a092-063bf734dcf3.mp3";
export const meal1Kan = "94ddcc66-be90-4e53-a2a9-807ba2d806f4.mp3";
export const umbrella1Kan = "4b8506c2-54c7-4b3e-a6fc-c480c523025b.mp3";
export const Math3Kan = "a741d4be-bf8b-40e4-a319-7a33dafd8ff9.mp3";
export const AngerKan = "84717914-43ca-485a-972d-061b2baa3672.mp3";
export const sunRaviKan = "a44edcf3-8317-43c6-953a-3b097e2f224a.mp3";
export const MathKan = "8290ac8a-5d00-42c5-8e83-c85fff8e588b.mp3";
export const catKan = "4b1d8214-2893-45c2-adf1-9c519f917bec.mp3";
export const necklaceSaKan = "d21365c9-92e7-425d-b45d-252af71492d1.mp3";
export const mealKan = "f2fe88cf-10f5-405d-ac18-8a538f1bd4b0.mp3";
export const greenKan = "f8f2d0eb-0399-4bd4-ac6e-2a50e6254a3d.mp3";
export const Math2Kan = "c528868b-8bcf-44cf-9378-7fd810500b9d.mp3";
export const wolfKan = "8f76d2a8-d906-49f4-a687-eb819ea9bf3b.mp3";
export const RasajuiceKan = "6583e09f-1260-4dab-bbeb-96e4715890df.mp3";
export const Math1Kan = "f8fa9cbe-5087-442f-98ec-2f5b23a18861.mp3";
export const lemon2Kan = "b63e262a-995f-4b90-8d23-69adc8b6adb8.mp3";
export const necklaceRaKan = "a4cc4dac-3a21-4c04-8383-d65f48af88eb.mp3";
export const lemon1Kan = "c4cd5df1-bea1-47f3-a3bc-79c66c9f0767.mp3";
export const TreeKan = "5fe61ac8-f25a-461d-bfb6-81aecc0014e9.mp3";
export const bear2Kan = "31ae4bb0-1cdd-48ad-af43-39d7dfd7c75b.mp3";
export const bear3Kan = "917610b4-c7ea-47f5-b589-c181238ca251.mp3";
export const collectionraashi1Kan = "cc43716c-ebb5-4b3c-b726-20587d59e4f6.mp3";
export const bear1Kan = "8a374284-f274-4884-abb9-adafaa4db42b.mp3";
export const wheat1Kan = "40ebe03b-bbbe-4f20-91be-4245a3f0bb60.mp3";
export const cotKan = "aea94a39-3d0d-4c2d-9dc2-b2b9da5a80b2.mp3";
export const collectionraashi2Kan = "98e14a53-90f8-4521-9932-7e40bd11260e.mp3";
export const Chocolate1Kan = "779975a1-703c-46dd-98e4-b1a6eccf4707.mp3";
export const crow1Kan = "460c22ea-b15d-4e26-ae3c-92856dfe37c6.mp3";
export const crowKan = "28e21bc7-ce7f-4ada-b306-c91f60515648.mp3";
export const beautifulnecklaceAndadaSaraKan =
  "2d56512d-7ca0-4687-a086-44ea39385d6a.mp3";
export const crow2Kan = "adefa64c-d242-4299-90e5-0d20deea5c05.mp3";
export const wolf2Kan = "9cbba068-32da-4085-8b1b-2500fcfb9298.mp3";
export const spiderKan = "bcdacfa0-e46f-46d3-9307-441197ff71da.mp3";
export const Boy1Kan = "168292b8-cd83-4503-9c52-953f640419cc.mp3";
export const necklaceKan = "aa75e391-88d7-415b-9bbd-9e8d891dc7ed.mp3";
export const collectionraashiKan = "1e3f42ec-b672-4978-8cd2-615d697c940b.mp3";
export const wolf1Kan = "5dce7cb7-3704-44e2-8546-510699e20548.mp3";
export const FlowerKan = "7f9c5555-b13e-408b-b401-3fda6e82e30f.mp3";
export const Boy2Kan = "ce7cdf61-c57d-4deb-96a5-296e1ff878b8.mp3";
export const Boy3Kan = "7aa7b406-b9af-4b14-90fe-32b1b74edebb.mp3";
export const NecklaceinBingosheetKan =
  "ee9d9235-8ea1-4bb3-b2cf-e385116b1be3.mp3";
export const wheatKan = "eade42c4-852b-4f1b-bc45-28d95a99d962.mp3";
export const lionKan = "10c8d9e7-c06d-4587-af46-4d78380acfca.mp3";
export const hooFlower1Kan = "726b6ea7-1112-40c4-9ba1-c1bcbcf234e4.mp3";
export const juice1Kan = "518f3c2a-1ba6-4260-ad95-8cba4757e57d.mp3";
export const hooFlower2Kan = "eb390237-41d3-4ac7-9657-98cbf37e987d.mp3";
export const juice2Kan = "2666b55a-3f01-42ab-88b0-2e3afb8dfad1.mp3";
export const rousterhen = "e6365a0a-99cc-4bbb-be4d-8e7ca1cf9f2f.mp3";

export const rootsR1Eng = "11dd1bb8-48df-4f2d-8854-7900f1766b2b.png";
export const earsR1Eng = "f3f06570-9b51-409f-8a37-06314b6e4936.png";
export const inkR1Eng = "cc8c0b7f-d157-4a7a-804e-d369e2c13b38.png";
export const hugR1Eng = "3ed1d950-3643-4980-b5ae-2b403aa10f09.png";
export const ringR1Eng = "aac72044-dcc4-4a11-bfe3-e5db2cd3b34c.png";
export const antR1Eng = "743a2885-2e37-43d8-8b9d-ad50255cef00.png";
export const cubR1Eng = "d84d6c00-94b8-4a56-957e-fc7e3a1c4b9a.png";
export const spinR1Eng = "4c085ed5-66ca-47a4-9e05-3e16e351aa8b.png";
export const bikeR1Eng = "74163f6a-6ad7-4964-90ce-b0825fea13f8.png";
export const speakR1Eng = "31c9a7df-1de6-4a8b-ba1a-dfd242427f2f.png";
export const mealR1Eng = "a70b44ac-2d7a-4419-8f9b-1d2215a1a662.png";
export const aimR1Eng = "2a53a1ea-e5e4-48c1-b2ec-42ffc6db4027.png";
export const farmerR1Eng = "d8a50a12-779e-46de-be89-041e97b3faa1.png";
export const beltR1Eng = "e77d2e57-924c-47c7-bd69-bcc418947eea.png";
export const beeR1Eng = "b7a3c1ae-0989-487b-a57c-0c2cbca819a5.png";
export const tieR1Eng = "aebc9b9b-099b-4980-a824-c014cc39e378.png";
export const hutR1Eng = "4af6d3f2-b875-42a6-b04d-c8c05960d684.png";
export const saltR1Eng = "447c0899-924f-4b87-a80e-60268cdcf65e.png";
export const dollR1Eng = "2e48a610-0ff4-48a3-a80d-8e7b6010a063.png";
export const flagR1Eng = "7eb6abef-dca2-465a-af2d-3101269f4358.png";
export const pigR1Eng = "b1fd1eb0-9a8a-4711-aa18-4dc22845f5c0.png";
export const legR1Eng = "ff23a0e7-f8a4-4a4a-83d4-539afe8da087.png";
export const soapR1Eng = "6fa6bf47-648b-4d4c-98b7-e18034388385.png";
export const gateR1Eng = "527d6d07-6032-466e-85cd-c5be56063d77.png";
export const leafR1Eng = "2b53d95a-47da-453d-9916-6e4cdf8458d6.png";
export const cryR1Eng = "8d719644-6719-422f-bd5f-c3811c4d2433.png";
export const bodyR1Eng = "04bec590-c5ac-4b3f-8a40-305beab4cac4.png";
export const trayR1Eng = "1aa34ba9-6a6a-4d7d-b87e-af6cd3097b30.png";
export const fireR1Eng = "f8b48edd-d432-4c15-b8b9-558d53c78821.png";
export const giftR1Eng = "6fabf70c-e84a-41e6-984e-801db57ab395.png";
export const sickR1Eng = "9d22d2de-968b-415a-bfcc-5f37b22b48c3.png";
export const pearR1Eng = "a58b45df-a767-43a8-bf1b-21b195b01390.png";
export const limeR1Eng = "c23da650-8b75-41d3-a9f9-557757282d96.png";
export const fortR1Eng = "1c962afc-60e4-4d54-94f0-9da9157270da.png";
export const shoeR1Eng = "6e365a19-256d-412a-b2e5-4ecc10e5ff9e.png";

export const flagR1Audio = "67b70da3-132c-47ca-a80c-07833f0405ab.mp3";
export const shoeR1Audio = "7373d30d-b4e5-4f3f-bc63-bba5960b3998.mp3";
export const aimR1Audio = "fbb3b323-83a2-4bca-9924-8524d5629064.mp3";
export const inkR1Audio = "e8a561a1-3272-4014-b0dd-11526b6c4e9a.mp3";
export const antR1Audio = "1b51b325-3eb8-47dc-b037-e49b3dc17d9e.mp3";
export const pigR1Audio = "ed06298a-3d68-4be9-a6f3-9ea8210b7174.mp3";
export const cryR1Audio = "b362b5f0-42f4-438f-b372-1eb94dd234de.mp3";
export const pearR1Audio = "85cb7804-e614-4b45-92b4-3b50fde3786c.mp3";
export const cubR1Audio = "c0dfc8df-5e4f-4032-804b-411bd90ee10d.mp3";
export const beltR1Audio = "a3a13ea8-5659-4bbf-9b9f-d07da987701f.mp3";
export const gateR1Audio = "31bd7a47-e2a4-4597-ade8-9e8c87cddb19.mp3";
export const legR1Audio = "b5d35fd3-b664-483d-8876-439e1b71cbdb.mp3";
export const fireR1Audio = "4ac14e29-88f6-40db-8ee1-7315ab6cf42a.mp3";
export const soapR1Audio = "9f0c8f12-180c-485f-bfa8-f27267ac2454.mp3";
export const saltR1Audio = "dad662cd-80a2-4ef7-b15c-dba11cc3c14a.mp3";
export const hutR1Audio = "c6d3cf91-d956-4b70-81f7-b410b098b517.mp3";
export const bikeR1Audio = "6d7f789d-8b72-4e16-9743-ed6f77eba325.mp3";
export const beeR1Audio = "db8765ad-030c-4b26-93d8-dab3cfe0228e.mp3";
export const rootsR1Audio = "58810617-7c73-42d4-a425-a085b055f4a8.mp3";
export const hugR1Audio = "d42ee76c-3a85-4dfa-bf5b-38902a076a69.mp3";
export const trayR1Audio = "c377d5eb-9af4-4a93-b50e-058c7073f48b.mp3";
export const tieR1Audio = "efa35d5c-5d21-48b0-a077-80af14f36f40.mp3";
export const farmerR1Audio = "726c7997-3528-47be-b76c-69fed2f63102.mp3";
export const bodyR1Audio = "1269fef6-7d14-4a84-8223-687ec77add08.mp3";
export const giftR1Audio = "d13063fc-eabc-4c3a-a698-ec6962526c69.mp3";
export const leafR1Audio = "db0127b9-01ab-4fa5-b20c-a90f6831ac3d.mp3";
export const ringR1Audio = "3423be3a-26aa-4b47-a7db-5a39d483b238.mp3";
export const earsR1Audio = "28daa479-274b-4184-9a12-b0c69d03add4.mp3";
export const sickR1Audio = "ba690366-d72e-4080-ba55-3fad77097d75.mp3";
export const mealR1Audio = "e76bfd65-9cc8-4102-abe8-a6222f7b9e61.mp3";
export const spinR1Audio = "fc6ba775-cd8a-4cab-b2a3-48de9aa750e7.mp3";
export const limeR1Audio = "4ee9f5c3-0cf3-4f09-bbea-92332add752b.mp3";
export const speakR1Audio = "2042a4a8-a780-4584-a0a5-fa86c56e4d48.mp3";
export const fortR1Audio = "2cbc3d5c-8589-47d1-8760-e940589c8286.mp3";
export const dollR1Audio = "f88f6d77-7f1f-447f-b41e-457046c5777b.mp3";

//Hindi
export const saltR1HinImg = "35679283-bb50-4089-9785-5a62b3898811.png";
export const gadaR1HinImg = "4026edda-b3b8-49c4-b868-c1fb3e9e9844.png";
export const BrushR1HinImg = "2aece540-fc5d-4c6c-a8e1-7830f8a3868b.png";
export const cupR1HinImg = "9311dbdf-2f78-4960-8d21-cb11379d98fa.png";
export const carrotR1HinImg = "b5b2cd8c-791d-4109-b37e-2f412e183d7e.png";
export const batR1HinImg = "04dbd063-c1d4-4a5a-88e7-624db87cc487.png";
export const mathR1HinImg = "4f1b5f28-d5ca-4a32-848d-a02e15bb8164.png";
export const dressR1HinImg = "1975dfee-a248-4894-8d13-39fe1488237f.png";
export const kiteR1HinImg = "38b0f4bc-f11b-417a-83fc-76281a778561.png";
export const legR1HinImg = "21225710-80b0-4bc2-838a-78e178218e56.png";
export const eggR1HinImg = "e2d0bfa2-689b-40e6-9cc4-f47be6f8735a.png";
export const crowR1HinImg = "8f61b1aa-3aeb-4923-9558-58ef61211308.png";
export const snakeR1HinImg = "add5c432-7b87-49fe-81ed-4e759ff07328.png";
export const fruitR1HinImg = "3a4f1519-0bee-4d63-96f7-5184b94183b3.png";
export const rubberR1HinImg = "f8dba839-3f1d-48e5-9f13-a86ef1668d4a.png";
export const gamlaR1HinImg = "4afc7e62-ec6e-467a-8186-1ba825b8ae00.png";
export const houseR1HinImg = "0cea6cf1-dc12-4c56-ac93-1fd3a8939f55.png";
export const knifeR1HinImg = "88cdf3f0-3bb5-44d7-b795-d0c5cfee5cc5.png";
export const kamalR1HinImg = "749de4d3-2ca0-47d5-a49c-6f94b26302df.png";
export const TyreR1HinImg = "53335a70-2aaa-4ce4-9c1b-02130f6d6e42.png";
export const chandR1HinImg = "27b97375-e96f-4465-82cb-fcfbc784106b.png";
export const carR1HinImg = "73e9f4ce-017b-49ee-ad2a-ea621cf303b7.png";
export const singerR1HinImg = "4570786d-335f-4ed3-925b-d6da363f6b13.png";
export const cowR1HinImg = "b38f619b-724d-43da-ac96-c5de8c7f5bc2.png";
export const parrotR1HinImg = "54f46d87-ad18-41d5-9e58-3df0db71b308.png";
export const neckR1HinImg = "57312033-c761-453c-9095-90d218fa24fa.png";
export const teethR1HinImg = "9b7f58c0-f2cf-455b-921e-ae834ffe5a15.png";
export const teaR1HinImg = "7d561707-d296-4e75-a280-aa83c6a57869.png";
export const fireR1HinImg = "ef931be3-aa4d-4c1b-99a8-3a65504941e9.png";
export const lunchR1HinImg = "8b4cbbdb-fb10-4c48-8ea2-f4a9a77431ae.png";
export const EagleR1HinImg = "18e5bfb0-6cef-47de-a802-c35b6592c935.png";
export const kadhR1HinImg = "d910f90b-df1d-4f42-a18c-25af02c69d72.png";
export const hockeyR1HinImg = "d3d39b5b-0507-49be-9dbc-3ed38f4fd351.png";
export const oilR1HinImg = "d1336777-e3a9-4e0d-a511-3959b66d9ba3.png";
export const bodyR1HinImg = "224fb3a1-d54a-4f25-831c-7273430f49d4.png";
export const donkeyR1HinImg = "068e40b7-b1bf-4464-9ad0-398f7a6b0e25.png";
export const coffeeR1HinImg = "e7d1ddf2-e969-4a24-8e76-96d11742013e.png";
export const tigerR1HinImg = "7a005b3c-44c7-4bf9-8bca-fae9e6e45acf.png";
export const noseR1HinImg = "c5532bc6-c53a-4fb6-a660-2a50a0e8f2a7.png";
export const ballR1HinImg = "2c8bc57e-2343-4314-80ec-9508122b0dbb.png";
export const danceR1HinImg = "def8886a-66ac-4a93-be4f-65aaac0110b6.png";

export const namakR1HinAudio = "bf35c9df-e7cf-4d95-8438-81e689eae72e.mp3";
export const samayR1HinAudio = "bd815a00-c748-4974-9b2d-950b6495626f.mp3";
export const patangR1HinAudio = "83fad1ef-812b-47af-899a-68c4c4d05b9e.mp3";
export const rabarR1HinAudio = "eaf4606a-4b1d-407e-85ec-46985a1eccf7.mp3";
export const gajarR1HinAudio = "7c09b6fa-d311-4d5f-9037-96da061c9c67.mp3";
export const dawaR1HinAudio = "c1b26fd1-42cf-4e76-a9f9-2e8182ea79f4.mp3";
export const bagR1HinAudio = "67cc14b4-a7db-4eb5-a87a-3d8f81cf18ff.mp3";
export const telR1HinAudio = "00717d5e-0bfe-4e0f-894b-a23ce0c3085d.mp3";
export const hansR1HinAudio = "a1c649e5-64f4-420e-b19d-c0933fafa6ea.mp3";
export const auratR1HinAudio = "11a6d259-0ce9-4d81-813b-1e495f9cecfc.mp3";
export const ganitR1HinAudio = "6b49cc42-40c6-46f2-ac22-e7df72307c7d.mp3";
export const sherR1HinAudio = "877a5aaa-8ee0-4de1-b48f-93d40274dfd2.mp3";
export const gendR1HinAudio = "6a4ce78d-41d8-45a9-a891-a5cdd193601c.mp3";
export const andaR1HinAudio = "8f259816-ceeb-4ebc-9b26-5d003cff20ec.mp3";
export const kauwaR1HinAudio = "baa7f0a0-8122-4d96-99ca-ff6d943999ab.mp3";
export const chakuR1HinAudio = "ce0ade9b-5c2d-4de2-8fd8-4395a762f5a4.mp3";
export const totaR1HinAudio = "95cc59c8-f13f-4087-a29a-9056876bdb77.mp3";
export const cheetahR1HinAudio = "4be8b3ae-0f01-46b9-9185-46406154569a.mp3";
export const aagR1HinAudio = "b223aaa0-475d-4e52-a37d-81981a339e0f.mp3";
export const kapdaR1HinAudio = "5c2a9e36-e383-4480-a05c-381d69bcb33a.mp3";
export const magR1HinAudio = "9d07e5b2-300c-4a23-865f-e7780a9bdebe.mp3";
export const galaR1HinAudio = "08af93ff-e425-4b5c-9604-9c2bc2fee51b.mp3";
export const chaiR1HinAudio = "1147325d-e9c4-4c65-a670-548fcc11ad85.mp3";
export const gharR1HinAudio = "fdb084db-28bb-4bf2-ac5e-a6ed8077c5e7.mp3";
export const chaandR1HinAudio = "46d33571-9401-48e8-a685-8f43bf8821bd.mp3";
export const taangR1HinAudio = "a50ded93-f32f-42c4-8de1-bf6091128797.mp3";
export const autoR1HinAudio = "1c60f6f1-57fc-4bcd-a8f0-a52350e6083e.mp3";
export const baazR1HinAudio = "10abc4b9-4fd5-4d7c-a19a-bdd28cf18758.mp3";
export const saapR1HinAudio = "9b0beae6-948b-4758-b2f2-051b939e6124.mp3";
export const gayakR1HinAudio = "ed8b596a-f5ba-44c2-af77-7ffbf9812192.mp3";
export const tyreR1HinAudio = "97fc5914-ff74-4e58-844d-f4549a2c0eda.mp3";
export const talaR1HinAudio = "dda6a383-3c85-4cc5-929f-6082f5593447.mp3";
export const gamlaR1HinAudio = "c6905756-4728-447c-b7b2-fd5c999b8065.mp3";
export const morR1HinAudio = "ebcb2dd3-fe39-4cc6-b05d-cbdaadd7262b.mp3";
export const gadhaR1HinAudio = "27cb3af4-9ebb-4db5-8e11-e5af99a872bc.mp3";
export const coffeeR1HinAudio = "775aedf1-83c1-42c2-955c-1a69cbc71967.mp3";
export const eidR1HinAudio = "1b11483f-6799-4d6d-956b-eff710e22d72.mp3";
export const hockeyR1HinAudio = "fba2eb7e-d966-41cf-9f1b-776ef3397e50.mp3";
export const thandR1HinAudio = "437e1deb-197a-4ed2-a5d2-5a3d09a01765.mp3";
export const tanR1HinAudio = "36f9b687-9cd0-45a4-a225-e47c9510d6ec.mp3";
export const kalashR1HinAudio = "c8ed585e-2a8f-4bb0-96b6-32dc258026a9.mp3";
export const manjanR1HinAudio = "804bb65e-d72b-4b0a-a163-7f72c2d85137.mp3";
export const pankhR1HinAudio = "edb45d84-2287-4754-b29a-258c2b99f6a4.mp3";
export const batR1HinAudio = "bf005eb0-3dc2-4c3c-83ca-95ae6a2d3edd.mp3";
export const dandaR1HinAudio = "a5a55ee5-cc45-42ff-aa93-78d522896543.mp3";

//kanada
export const fireR1Kan = "5fc434bc-8742-446a-8d23-7c463d099931.png";
export const pocketR1Kan = "556f4375-050b-4c84-8ee0-2ac2c45c3ab2.png";
export const ballR1Kan = "5e5217cc-bddf-4430-9137-4905062bf883.png";
export const jeepR1Kan = "c4b4b4e3-54e4-499d-9473-e1614c85e828.png";
export const riverR1Kan = "d890346a-47bb-4122-9dc1-8328e4caec47.png";
export const kneeR1Kan = "8889d569-236e-42bb-a72b-db503f6b7c97.png";
export const scorpionR1Kan = "db5c1034-795a-4ccf-8fcc-da5e063e935c.png";
export const henR1Kan = "31af0d71-bc9a-4ac9-8e09-083b8dcf8aff.png";
export const autorickshawR1Kan = "04314738-72f0-4866-8a05-b744020f3461.png";
export const appleR1Kan = "f9089145-068a-41bd-be3b-dfb60e9c970e.png";
export const trainR1Kan = "0419c5ae-42c1-43c2-abf2-35f4f5048fae.png";
export const tailR1Kan = "4a9f4cd2-2861-450f-af1c-2338299f8b85.png";
export const maleR1Kan = "56e52a2b-0083-4bee-b255-faaeda8097f1.png";
export const babyR1Kan = "9e0b6a51-0da5-4c08-b8e7-a189a49febf6.png";
export const capR1Kan = "f9a897aa-53fa-44d6-9d6a-01b5871e0937.png";
export const footR1Kan = "75ff38d1-c20f-4662-82cb-0666b301668b.png";
export const matR1Kan = "9cbf3efd-855e-40c7-9b98-8af6b62f7840.png";
export const mugR1Kan = "e0eb88f3-517e-4986-a878-e72fb44ecb2c.png";

export const tortoiseR1Kan = "ac0ec0d9-e5d9-46d4-a8ee-d1ac1180e837.png";
export const milkR1Kan = "1f5e9c26-074b-4fb6-ba06-5edeb8246af4.png";
export const treeR1Kan = "e5ebe10e-e693-43bc-85bc-5e5445c6a2d7.png";
export const elephantR1Kan = "4f868e0c-2083-4e54-a9bc-8efbc00853a2.png";
export const juiceR1Kan = "253be7af-62a4-4ad6-a4fe-7c8d8875ac6b.png";
export const noseR1Kan = "e3f79c17-364d-40df-9a08-6c671b7cae79.png";
export const mangoR1Kan = "875bdea8-41cc-476c-b77f-b071e45075c3.png";
export const snakeR1Kan = "2fe9ea58-bfc9-44e1-a1a9-5f75c0cffe29.png";
export const glassR1Kan = "63805784-796e-48ad-b397-b127b1fa4b88.png";
export const leafR1Kan = "1ab8ba13-1444-4726-9846-56d4a3fa6af4.png";
export const laughR1Kan = "fb24a9ee-5c68-431a-a13c-f942f8da9983.png";
export const spiderR1Kan = "db5a0a1b-a72e-4a75-b918-750361a83068.png";
export const ratR1Kan = "b7398640-dd33-48f6-8b0b-114a3abf716b.png";
export const plantR1Kan = "37f991f6-3ad5-4fca-8c2b-6bff2dd3e6ee.png";
export const carR1Kan = "4fdf22f2-5cfb-4e77-b78a-33bf4bde5f21.png";
export const honybeeR1Kan = "807cbe40-fcc9-4bd2-bba9-95fae22ae2b5.png";
export const parrotR1Kan = "a9fd96ee-79d8-4e3f-b705-0402b45f8201.png";
export const cowR1Kan = "7de24b49-60ba-4606-9935-05655c84a9b7.png";
export const monkeyR1Kan = "4625d6a7-735a-44ce-827f-412a333f61f8.png";
export const lionR1Kan = "f013bec3-01c9-47e8-8b20-2d6f0e5e43ad.png";
export const shirtR1Kan = "bd7e3f92-4b58-47bb-bd58-3465b1db2b26.png";
export const pigR1Kan = "0e5ca94a-7d8e-4d44-bbeb-7fa704f264dd.png";
export const legR1Kan = "4e763f2b-a515-49ef-95f2-d5883204611c.png";
export const wolfR1Kan = "247556cf-5dd9-4757-997a-2f594dcefeb0.png";
export const crowR1Kan = "10ccda66-2338-488e-8dc5-103663377c43.png";
export const cloudR1Kan = "4eee37f0-d8f7-4b4a-a29e-f63fedc1f063.png";
export const featherR1Kan = "d3aeb3a3-f26d-455b-a062-3480021c32b4.png";
export const fanR1Kan = "5cc5d654-e65c-4146-b5bb-be97e0623540.png";
export const jarR1Kan = "ffc2835c-965a-493f-be65-fcb0c3da9187.png";
export const farmerR1Kan = "8467ba2b-ed51-488c-93de-b7b2017bdc78.png";

export const TrainR1KanAudio = "f9d7088e-8f3f-4c33-af83-1baecd4b090b.mp3";
export const AppleR1KanAudio = "e8726e7b-65e3-42f1-b0c0-060450114059.mp3";
export const CrowR1KanAudio = "4afcc152-8d0c-43bf-8ca7-d1952f8a64db.mp3";
export const wolfR1KanAudio = "34bbb7fa-708e-4598-8845-a27abf81612b.mp3";
export const ShirtR1KanAudio = "536f2ed0-f0d1-41fa-a978-9f2b1d4d8020.mp3";
export const AutoR1KanAudio = "4779b03b-d5bc-4e9b-a384-be01419dcff5.mp3";
export const HenR1KanAudio = "1e580f9b-d731-46fa-8432-8f1920050dc5.mp3";
export const JarR1KanAudio = "d960bcc8-a5d2-49cb-89ed-91adb092b879.mp3";
export const MatR1KanAudio = "e4cc36b1-47b0-4ca5-90a3-15b101242bd2.mp3";
export const MugR1KanAudio = "7bf39a59-8ca7-44bc-824c-5ca5b18589fa.mp3";
export const BabyR1KanAudio = "7769efb2-b660-4c07-a890-ce18fa105f18.mp3";
export const TailR1KanAudio = "e6707a09-25ab-4f0c-b2ae-640d3b3d953f.mp3";
export const MaleR1KanAudio = "f1a705d2-8510-402a-9da1-961548d5257d.mp3";
export const CloudR1KanAudio = "4bb1f4e4-e428-4f31-ac93-2b02405867be.mp3";
export const FootR1KanAudio = "e328620d-ce1e-43ed-adf9-fda97c639d7a.mp3";
export const CapR1KanAudio = "5ab3e5d3-1de7-4da6-a666-5ec7be2ec251.mp3";
export const TortiseR1KanAudio = "d3a13b02-0f16-4525-993f-10c08cc52237.mp3";
export const ElephantR1KanAudio = "3c984dec-e64a-4460-88b1-acbf09f73293.mp3";
export const HoneyR1KanAudio = "f6508d38-0737-48bf-a801-fe156960ba4f.mp3";
export const MilkR1KanAudio = "cb450fbd-2cd1-44bc-a8ce-9f9a39ffed69.mp3";
export const MangoR1KanAudio = "00759f37-30c7-4c7d-b11d-12cb5a18f956.mp3";
export const PocketR1KanAudio = "859115ff-f37e-4a75-8b49-5b3a36244c05.mp3";
export const BallR1KanAudio = "2e45d14d-71f2-4d7b-9045-1858614cdda9.mp3";
export const JeepR1KanAudio = "c6de5627-db40-435e-b260-cd1b9d5982bb.mp3";
export const NoseR1KanAudio = "8f2732c2-5535-4dfd-8188-ad9282862861.mp3";
export const FireR1KanAudio = "1df79e2f-df91-4496-a285-7d2040e0176c.mp3";
export const MonkeyR1KanAudio = "ee9812bc-61ca-4d85-9523-1ac72207d7f3.mp3";
export const KneeR1KanAudio = "2c3d79be-55e6-4149-a5eb-9eb728c564a6.mp3";
export const ScorpionR1KanAudio = "c00f0608-fb5a-493a-8d7c-7fd7634214fe.mp3";
export const SnakeR1KanAudio = "9ad1dfcf-2ec5-4314-83e2-9ff5e52a2625.mp3";
export const glassR1KanAudio = "5ae6d35e-ab89-4d10-ab9c-c5f19cd17a45.mp3";
export const RiverR1KanAudio = "739b87a8-17b0-4112-9c59-abcf30105b2f.mp3";
export const plantR1KanAudio = "dba0a1d6-dafc-4447-8133-cd0a9b8322ce.mp3";

//tamil
export const leafR1TamAudio = "918dc98a-1c64-4ca6-a253-2e97adf9ab1c.mp3";
export const tortoiseR1TamAudio = "6f98a42e-82fa-40b6-bf40-04484c9cafb1.mp3";
export const maleR1TamAudio = "cd8b80ee-2935-4d3b-a409-1398bccef35b.mp3";
export const elephantR1TamAudio = "cb0e93df-7aa4-47b1-970d-664b84727af6.mp3";
export const thunderR1TamAudio = "55afbc7e-0c43-412b-9ac8-a8b90d975ff6.mp3";
export const parrotR1TamAudio = "dd2a5925-ff9e-4e74-8e0a-dbec45e6af08.mp3";
export const basketR1TamAudio = "b89cdc66-78ad-48ad-be0d-044ffceeb3fb.mp3";
export const mosquitoR1TamAudio = "a1871488-76a4-4892-b6dc-171b70a8db6c.mp3";
export const flagR1TamAudio = "b1305c27-f95b-40cb-a4ac-65881fe8b031.mp3";
export const plantR1TamAudio = "58f8cc53-e6d8-44b8-85f8-3dedb26ab188.mp3";
export const moonR1TamAudio = "218c2081-c19b-4f06-9db1-44d17d15cf18.mp3";
export const penR1TamAudio = "680feca8-f891-4278-81db-532de3e0d421.mp3";
export const cowR1TamAudio = "f68e8047-94de-4115-ab2e-ecd2094bf220.mp3";
export const moustacheR1TamAudio = "173729b4-440f-4de1-b3d1-634031b459fc.mp3";
export const jarR1TamAudio = "b7dc6699-1cfa-4873-9c47-e75b0e475888.mp3";
export const jumpR1TamAudio = "09d53931-c125-41c9-a1b6-a1bb1e88e4f9.mp3";
export const swordR1TamAudio = "5e7bccb3-345f-45cc-b3c2-76d933cbb53e.mp3";
export const bellR1TamAudio = "5b52c221-c7a9-43e2-9db0-2c3b0dd6accf.mp3";
export const umbrellaR1TamAudio = "452e6f87-4005-4b85-a289-208c1a3de610.mp3";
export const personR1TamAudio = "35052241-1ebd-4a81-89d3-c6a9128e5502.mp3";
export const muscleR1TamAudio = "5f11f329-d1b6-4021-be80-ed07e364ae5c.mp3";
export const meatR1TamAudio = "57a1ca66-df8e-43af-b054-53a10c01156e.mp3";
export const alcoholR1TamAudio = "0fd65550-f716-4d16-b0dd-79c7a9cc905a.mp3";
export const laughR1TamAudio = "bb57b6d3-02f0-442e-8500-3ff6847f3460.mp3";
export const roseR1TamAudio = "8bd43bfc-7b14-41e9-a600-84c67730b0e1.mp3";
export const cookR1TamAudio = "e648e270-26a1-49e6-9392-a5950ec12483.mp3";
export const snowR1TamAudio = "4e1ca7ae-1283-49a4-a6b3-b61527354835.mp3";
export const infantR1TamAudio = "93897b2d-7df1-4c96-acc9-950be5eddb13.mp3";
export const musicR1TamAudio = "f935e3da-4299-40b0-ba13-2a4da6b6ce15.mp3";
export const runR1TamAudio = "fdfb0e99-0306-4460-8ad1-b8ece5173b5f.mp3";
export const honeyR1TamAudio = "163c45b4-1981-4925-938b-602f8724bf66.mp3";
export const drumR1TamAudio = "9f25f348-0000-4d5a-a244-813aac105b65.mp3";
export const houseR1TamAudio = "fc09a6d9-02b6-4dac-b8e2-911266959dd4.mp3";
export const headR1TamAudio = "9bfe3633-ce87-4f36-b0ed-530f3ed1be10.mp3";
export const rainR1TamAudio = "451a4c77-50f1-4083-a236-90b5360cc181.mp3";

export const honeyR1TamImage = "49c982d4-5bc2-4069-a4c4-d966ca05a89b.png";
export const rainR1TamImage = "7fe91e0a-d0a2-46b0-8e06-e6b18eeb54d5.png";
export const jumpR1TamImage = "931e8bd7-74e1-4ff7-9de5-ebf1909a993c.png";
export const drumR1TamImage = "306b6cf2-8f13-4693-b8f5-04ce69db5ccf.png";
export const umbrellaR1TamImage = "6be491e0-4e6b-4d01-880f-b54b1b630b60.png";
export const vadaR1TamImage = "985a7b61-e656-4300-afcc-0c44ab271110.png";
export const headR1TamImage = "3612fb50-08be-4b76-8bd9-e3f3236e6b34.png";
export const muscleR1TamImage = "b2951de9-65f5-439f-9b4d-4b661a6e8447.png";
export const laughR1TamImage = "082a1896-15f2-48d8-a4ad-7e2de7809310.png";
export const roseR1TamImage = "201ecc95-73d1-4448-adf9-f879cc3884d4.png";
export const houseR1TamImage = "520b2edc-4fb9-44d2-9594-785e967699c4.png";
export const bellR1TamImage = "a1594241-7777-441b-b8a9-db48323e388e.png";
export const musicR1TamImage = "209359a0-036a-48f4-b309-719e5ad81640.png";
export const snowR1TamImage = "fb7b6e1a-95b9-4ce5-9dec-3b5b8bcfdbf0.png";
export const meatR1TamImage = "e7627edc-6a3c-4734-a5a8-71c855035666.png";
export const alcoholR1TamImage = "eaedf3ac-3e97-4f73-bd87-c7ed0c42f63d.png";
export const thunderR1TamImage = "7abcc255-1f24-41be-b566-50d6e8fddba4.png";
export const personR1TamImage = "2048e9ad-711d-452e-b8df-e16391f654f4.png";
export const runR1TamImage = "2999bd6d-1d1f-4022-a622-4d601a159a05.png";
export const infantR1TamImage = "a62ddb74-755f-494e-a622-0f59d953b9d4.png";
export const cookR1TamImage = "6dea434c-b432-4e23-924c-dd55db93bd09.png";

export const elephantR1TamImage = "8c162e7a-ccdb-4cda-92f0-8d79fc4923dd.png";
export const tortoiseR1TamImage = "5364c47e-6a80-40b9-912c-e88576db6ff1.png";
export const eyeR1TamImage = "56d3e6c7-672a-4fe0-a89c-a7e249e20c29.png";
export const fishR1TamImage = "615ed256-1727-498d-9522-97cb9d83e73d.png";
export const catR1TamImage = "f16d440f-6160-462d-bdef-f2d031ef6ce1.png";
export const teethR1TamImage = "bb51594e-43b0-48e8-841b-6344a97cf5aa.png";
export const parrotR1TamImage = "d78b3304-c5e2-4db7-9022-a2cdbe8e074f.png";
export const moustacheR1TamImage = "a12031b3-bed1-4b30-bef9-85a999709687.png";
export const cowR1TamImage = "bb70cb78-9e91-47da-96bb-f5f27b0e231a.png";
export const stoneR1TamImage = "50a2aea4-48b6-4c47-8c02-213a54bf74f1.png";
export const mountainR1TamImage = "1d878e92-5e6f-47b1-b9db-243db89e91f8.png";
export const leafR1TamImage = "5c48e3fb-1f0c-4aa6-a1ee-0926e7a039ae.png";
export const ratR1TamImage = "38adbdb6-b645-48c8-9659-a137d3bf0801.png";
export const penR1TamImage = "acee6797-d5b5-4102-8de4-f1f26d2a52ee.png";
export const plantR1TamImage = "b0e01ab1-33cc-461e-b7f0-2a4937aa6c6d.png";
export const flagR1TamImage = "360cae87-bc54-4e45-ba0f-8690908de281.png";
export const swordR1TamImage = "1c09ce51-dffd-48d4-890a-5dd181a82afa.png";
export const nestR1TamImage = "ebb639a2-2c94-4929-ad2b-a7eed84e50be.png";
export const drinkR1TamImage = "86bd4601-6672-490b-bb16-b4a36adb9196.png";
export const dosaR1TamImage = "dec4d59e-2b83-43c3-b908-90ef427870bf.png";
export const henR1TamImage = "dd1909f9-90fb-4da0-9416-89b8bcb8838e.png";
export const tableR1TamImage = "70588efe-b800-48b7-b86e-40cb9cfdac49.png";
export const moonR1TamImage = "0fe4c2ad-17fc-49b2-bce8-764a086cad47.png";
export const jarR1TamImage = "5faba9e8-ca95-429a-b8e8-5c10f458fd82.png";
export const basketR1TamImage = "90f7b654-3654-43dd-807e-0a04fdacf6c0.png";
export const clothR1TamImage = "91bdfa61-caf8-4fb9-b320-e23e7b7ccce1.png";
export const soilR1TamImage = "410aa8b7-6561-4866-9124-c6d8260e5eb8.png";
export const maleR1TamImage = "3266384e-1e48-49fb-9f67-2e76b801e78a.png";
export const mosquitoR1TamImage = "b81cd10e-7fe5-49a2-b7af-f017454c74ad.png";

//telugu

export const crowR1Tel = "e6cbaa4c-ade0-4c4b-bec1-2a33d8830626.png";
export const goatR1Tel = "77314dc3-b9db-4e3b-809a-87328c9fbabb.png";
export const legR1Tel = "7ed5581b-792d-4869-90ba-740cd686c926.png";
export const angerR1Tel = "e769302d-ed10-489a-b40a-9979dc3c63ac.png";
export const nestR1Tel = "e53c6444-e97c-453c-ba10-786ba992b33f.png";
export const ropeR1Tel = "980ef146-4b44-4518-ae81-435315caff34.png";
export const dosaR1Tel = "b9212109-3322-4db5-97dd-f5e739ba1f92.png";
export const lionR1Tel = "0cf85bf3-3595-4874-990b-e1d4f88fa06f.png";
export const pillowR1Tel = "320679d3-ad3e-4236-bf4a-a7068701de37.png";
export const farmerR1Tel = "48dd4318-2900-4d7f-8d06-0dd841686100.png";
export const castleR1Tel = "0119d387-e66a-4c0b-89b6-96204a0930c8.png";
export const medicineR1Tel = "55cb9e2d-693b-4d46-b87a-bb9594a53875.png";
export const sareeR1Tel = "c8bb1490-eaba-4164-8d8e-70185293a9cd.png";
export const mosquitoR1Tel = "d8770637-c23f-487b-b0b7-f3cfb632efe2.png";
export const fishR1Tel = "58695a1f-2634-4f6a-aa11-96fd8ec34da6.png";
export const rootR1Tel = "42728737-232e-46a2-9176-f630ec446e1f.png";
export const fingerR1Tel = "139711b5-7ace-4712-bf92-a6c29194de30.png";
export const cowR1Tel = "86df8731-fceb-448c-bce4-2513a8c04b50.png";
export const carR1Tel = "94417c63-db92-4f9e-8ce5-74ca530e887b.png";
export const plantR1Tel = "6faef597-2c99-4fcf-9506-630d066b7f30.png";

export const milkR1TelAudio = "74be2d6e-3a49-40b7-89dd-b95d59107e40.mp3";
export const duckR1TelAudio = "19b0c4b7-11b6-4519-a3e4-cf8f88b826ab.mp3";
export const neckR1TelAudio = "921abcee-01c0-4c0d-b547-17390fd07e9e.mp3";
export const neemR1TelAudio = "4baf5241-933c-49eb-8a18-d3527178209e.mp3";
export const leafR1TelAudio = "8f22b699-1af4-4c1f-9def-ca94483e52d7.mp3";
export const swimR1TelAudio = "feffb86b-d67d-4e1b-8e5b-32072924427f.mp3";
export const featherR1TelAudio = "f900835f-e53f-4df6-8200-e2abb83bc7b3.mp3";
export const penR1TelAudio = "c848b469-ea5a-44d4-a231-ad79ceb54b71.mp3";
export const schoolR1TelAudio = "5eb754e0-4399-441e-90f1-f81b280f76d7.mp3";
export const juiceR1TelAudio = "24fe676d-122f-4a0e-9d71-02f7ff12ae22.mp3";
export const shipR1TelAudio = "765147c9-d1f6-455e-8f2c-8d91af31ceaf.mp3";
export const swanR1TelAudio = "5ebb8cd0-83b4-442f-94ce-469f9434c5c9.mp3";
export const fruitR1TelAudio = "8a8904c2-003c-4615-bae3-6b77fb50af86.mp3";
export const ballR1TelAudio = "255305dc-9bc6-4783-a6e7-c36b9a567b85.mp3";
export const potR1TelAudio = "e2636eb7-c777-43ce-9d46-1e47533ae991.mp3";
export const sareeR1TelAudio = "8616c143-4082-4f4e-bd55-b412cc646f0c.mp3";
export const legR1TelAudio = "dff051db-4b6d-4e01-82d2-a9aa5f17f1dc.mp3";
export const carR1TelAudio = "391feffd-2cd4-402a-9c83-96d125fd621d.mp3";
export const ropeR1TelAudio = "bf4768df-a707-4773-8df1-ed7cfe24d167.mp3";
export const crowR1TelAudio = "e7b25f5e-afc0-4f41-b11f-427335b5a5c7.mp3";
export const castleR1TelAudio = "6893e906-5d52-4936-9660-40bc868938d4.mp3";
export const pillowR1TelAudio = "f90257db-9b07-4ade-b994-81df0b26d26e.mp3";
export const fishR1TelAudio = "a36affb0-019d-42c7-8437-7b31691e62c5.mp3";
export const goatR1TelAudio = "30656c75-db65-4c80-9a68-80e3670445c7.mp3";
export const plantR1TelAudio = "3b421f5f-e4c2-4835-839c-7a5fd40828e9.mp3";
export const dosaR1TelAudio = "e65fb3ec-bb44-49ea-8ca3-a9f53a1dd11e.mp3";
export const medicineR1TelAudio = "8745df6b-65c1-4656-9770-1ee3ab1d0feb.mp3";
export const lionR1TelAudio = "95736430-6c0c-4fa9-9dd5-112f2835a2c4.mp3";
export const angerR1TelAudio = "6fb31473-cf96-4ac0-8ab8-c4ea016f1f72.mp3";
export const cowR1TelAudio = "b897d8ac-d69f-4031-8810-17c7d5be1b4e.mp3";
export const rootR1TelAudio = "0a23607c-05e2-4e0c-bfe8-ae6c18b71e7d.mp3";
export const nestR1TelAudio = "56ba6df0-3001-4980-ab3f-73cb8408330b.mp3";
export const fingerR1TelAudio = "d1d9309b-3e64-4e89-aca1-8a88563c2784.mp3";
export const farmerR1TelAudio = "a3465c3b-5c46-4aca-8c82-3ee144009c39.mp3";
export const mosquitoR1TelAudio = "29872b1a-972a-4814-a21c-17a1a8076a00.mp3";

export const happyR1 = "2d7b652b-f7f2-4217-a5ae-f5acc820ea96.png";
export const angerM1 = "8579e8c8-6c2b-4566-86e0-0e6283006f59.png";
export const glassBowl = "adc1b5c5-847a-4419-a3cc-4b9afe67ec76.png";
export const farmerM1 = "9cac1945-c4c6-459e-a6c3-0bc84c8085ea.png";
export const sandM1Tam = "88e86995-6641-475a-a013-cc8ad9ef9d4e.png";

export const farmerWord1Audio = "3db65781-c256-4c0a-a9c4-15d1300d1481.mp3";
export const farmerAudio = "d787f198-eeef-429d-8f91-72475519bedf.mp3";
export const angryWord2Audio = "aa12937a-ea63-4bfb-a252-67baec684b50.mp3";
export const kurudanWord3Audio = "9cafbb9d-6b61-44cd-9e2f-5792c25899c2.mp3";
export const pomegranateAudio = "99bc10b7-7d0d-46d2-b5d1-77d219f23771.mp3";
export const happpyAudio = "fc15c712-b8ef-44e4-a188-2224f7140076.mp3";
export const angryWord1Audio = "ecdddf33-85d5-4d85-89e4-c734a8be0c19.mp3";
export const farmerWord2Audio = "c0b38951-318a-4aa0-a74a-8fb38d6e6883.mp3";
export const anngryAudio = "ee81768b-1442-48a9-9cec-1c4e1a2faf79.mp3";
export const farmerWord3Audio = "4dcdacc6-697d-4b1b-ba2c-bb008d65ee83.mp3";
export const kurudanWord2Audio = "12656acb-b737-4218-961f-99c722e216b4.mp3";
export const toothAudio = "686e6e94-561e-4411-af2d-afb91ef81f65.mp3";
export const koppaiAudio = "9ad957ff-e35d-46b6-84af-24262d6f646f.mp3";
export const kurudanAudio = "881d4542-3825-4ad3-bf18-373015b3f54b.mp3";
export const pomegranateWord1Audio = "7e36f605-91dd-48e8-b4e3-1c4dcd5fb3be.mp3";
export const socksAudio = "a85ab100-386a-4a34-b425-2c81c4594712.mp3";
export const bowlWord1Audio = "197f0025-d95e-4fd7-a424-79e1905066b6.mp3";

export const bowlWord3Audio = "fc772963-9357-484e-8038-6e46056cc883.mp3";
export const pomegranateWord2Audio = "fe62ad0b-9fd1-41c5-a62a-2aeea7a3ca61.mp3";
export const pomegranateWord3Audio = "df05b33d-9699-4681-bc8c-130c68a3e1e5.mp3";
export const bowlWord2Audio = "8005c0dc-0928-49a2-b348-225f83003f13.mp3";
export const bowlAudio = "25bec3c3-1fb9-4b87-b9e8-34756e8aaa0b.mp3";
export const kurudanWord1Audio = "a07d5a64-d0f5-48bb-8620-80d785305267.mp3";

export const dosaAudio = "428e298b-e899-4ba9-82b9-0d7a5b91f870.mp3";
export const youngAudio = "30055d1d-dda6-4b63-8b5d-255b71e2c360.mp3";

export const tableAudio = "51aac5fd-c86f-4df8-953d-7f74b98641bb.mp3";
export const socks3 = "cf9ed4ec-480b-4d62-98a6-14b7cbedc7e8.mp3";
export const socks1 = "4f2dc01c-3423-4d99-8d41-bbc3e5df17a8.mp3";
export const socks2 = "bcbad7b0-2fee-4c1c-bc7a-7e728a0aa7d7.mp3";

export const chopR2Eng = "6bd1645b-34cc-4f9e-b1e2-fc12273ba7e2.mp3";
export const sourR2Eng = "75cb06c3-9742-48c1-b441-eccef1f294e5.mp3";
export const roofR2Eng = "5ae1d5b1-8ac6-4932-bc85-1541a0b0981e.mp3";
export const yellowR2Eng = "a9477737-d531-48cd-b9fa-032799b06bbe.mp3";
export const woodenR2Eng = "530f8555-f50a-4708-a2f9-c144d8772e18.mp3";
export const crownR2Eng = "5629b0bb-21f2-466e-8093-729321e380b0.mp3";
export const cubeR2Eng = "58e1984b-f1f7-46e4-9fc2-9b49cf8fc1b6.mp3";
export const hugeR2Eng = "48ae5ba4-b85e-4725-9e78-6953a33ef0d8.mp3";
export const cowsR2Eng = "b7ac0892-30e5-4dcc-8a9e-83d684f84b30.mp3";
export const chewR2Eng = "229f90ee-fe07-4e1c-85ea-363013d4908c.mp3";
export const withR2Eng = "fc032d29-4696-4897-8231-955807d52d0f.mp3";
export const cloudR2Eng = "a2e4fe69-68d2-4c39-8b69-70064865e908.mp3";
export const thinkR2Eng = "630cfdb8-ff1a-41c1-92ba-324d07ffa7c3.mp3";
export const yearR2Eng = "e84c6b85-51b6-4a91-8421-20ee2ea60499.mp3";
export const woolR2Eng = "72effd71-2117-48f6-8d84-8e5d8c4bb64d.mp3";
export const enjoyR2Eng = "5227ed84-a8c2-4215-b093-58096f034689.mp3";
export const richR2Eng = "8fbab691-fd3c-466f-a2ac-ba8f91578075.mp3";
export const joyR2Eng = "79f5356d-3200-4e87-b2db-f042f0164fb2.mp3";
export const youR2Eng = "0350ddb0-5399-4908-9bdb-0faef8682148.mp3";
export const aloudR2Eng = "d0eba81c-6cab-4d40-9a62-b2771bbd04d0.mp3";
export const togetherR2Eng = "08279348-cb2a-4ff8-b31c-a643d2d974fe.mp3";
export const matchR2Eng = "cd31bc41-f611-4faf-aba3-3e49c66b0286.mp3";
export const thinR2Eng = "95b16f80-29d4-44e9-bc80-8a625a6695e2.mp3";
export const choiceR2Eng = "ccdf5937-cb84-4f5c-801d-fc6164e589ce.mp3";
export const childR2Eng = "e20f6d09-8549-4c30-92a5-8ac3cd8664a4.mp3";
export const nowR2Eng = "04ee6273-ef71-440d-969a-1091cb77b442.mp3";
export const fewR2Eng = "08f0ead8-abbe-45b4-9d5d-832cc04fdb27.mp3";
export const reuseR2Eng = "070b6b9e-08f7-4f08-88a7-2dfe24186587.mp3";
export const goodR2Eng = "34dff70a-f3b6-42b5-8643-8c8108988482.mp3";
export const valuesR2Eng = "6f4e7967-c697-49ec-9cf8-4d8460f7845b.mp3";
export const chartR2Eng = "a41a3da5-3ee8-466c-9ce7-ef5ddf6e6080.mp3";
export const outR2Eng = "3c78f58a-c154-427d-9347-0850d231e1dd.mp3";
export const lookR2Eng = "92cc84f0-4232-4cfa-a4d8-b9e7f1534bdb.mp3";
export const bothR2Eng = "68ecd5b7-0f69-4d73-be6a-776a7ab5c647.mp3";
export const youngR2Eng = "75fa1bff-5e7f-4c74-abd1-e5b33bf57e24.mp3";

export const parathaR2Hin = "0774f1fd-d529-43b8-b422-2f93c2e5fc95.png";
export const marijR2Hin = "f248d33f-dce3-4fca-a1ba-11ccbb7305d1.png";
export const chidiyaR2Hin = "42f01968-c763-4414-ab5e-a3fc35f0bb8e.png";
export const hasnaR2Hin = "5e98d1ce-0bbf-444b-8139-19d5581638a2.png";
export const dukanR2Hin = "8a5b94d6-1fab-412b-a3c8-e6138f98dee6.png";
export const pahadR2Hin = "2ac854e1-2ecf-40a8-8495-99c9e8c10b1a.png";
export const hathodiR2Hin = "bd9d634d-f4c2-4df1-b3da-d6b15a213ce6.png";
export const windowR2Hin = "6ef0a20c-b39a-417a-bea2-fe2164a61706.png";
export const kechuaR2Hin = "93c4f9bf-8198-4acc-8786-0d73870799ba.png";
export const parindaR2Hin = "eed713d0-f727-4971-8c1c-0473b5f064d6.png";
export const machliR2Hin = "bbdec033-c624-42d5-b160-2b6f579bacfa.png";
export const papadR2Hin = "b6abb3e7-5de6-4482-b5b0-2a1053977e7c.png";
export const kamijR2Hin = "c5813a39-cd43-4a84-afc9-926c8ac6e8b1.png";
export const pencilR2Hin = "c7d95601-8d37-4d59-967f-2d74952ffab4.png";
export const kachuaR2Hin = "29ddec75-398a-41fa-944b-0b4bb34f4d27.png";
export const lekhakR2Hin = "d39eac66-b8ee-488d-87ae-c6f1321e634d.png";
export const batakR2Hin = "3fcfe62f-5fe7-4212-beb2-16a78b895e45.png";
export const sangitR2Hin = "7decb068-097e-49d6-935e-70533baad8dd.png";
export const chimtaR2Hin = "44f3523a-114d-44f5-9c11-6da9978a0805.png";
export const bhojanR2Hin = "27b74e12-331a-4962-8ec0-4558e7f20b67.png";
export const bhedR2Hin = "1c8ede9b-e0e8-45b6-a308-661b6bcc8aa0.png";
export const pagadiR2Hin = "564aee18-3ad3-48b5-b576-422435c62d1b.png";
export const baiiganR2Hin = "a8225a22-579d-4866-9639-214624fb46c1.png";
export const jamunR2Hin = "86dc7e8d-0751-4f95-8f4b-04c8aa0e563d.png";
export const wolfR2Hin = "003f4cf3-5c51-4d75-8038-aa8efd642bc7.png";
export const ladakaR2Hin = "c2589692-9ac7-4c79-90d6-27e52ca6aa52.png";
export const lakdiR2Hin = "0f9bd7b2-ef34-4bfe-a123-ee282a40457f.png";
export const gulabR2Hin = "9c66f4ff-3097-4ac9-8004-61ec423b479b.png";
export const sainikR2Hin = "53dc39aa-3688-434a-9c8a-e771555e215e.png";
export const tirangaR2Hin = "cceb0c92-baeb-4ded-95d1-edc14e9cc199.png";

export const suarR2HinAudio = "5145be24-a738-4ffe-8b01-7755ebc99a55.mp3";
export const policeR2HinAudio = "f03e1c9c-885d-429c-a47b-4707dba58fb3.mp3";
export const badamR2HinAudio = "01f85d0b-9381-4d41-9e82-d72b07f6d800.mp3";
export const mahilaR2HinAudio = "6f398bb5-3f45-4422-8fa9-cbb4a7a2062f.mp3";
export const papitaR2HinAudio = "0d469527-d061-4865-871d-146fed983c1a.mp3";
export const bagulaR2HinAudio = "208f7b9c-6b97-4aa3-81e0-51ad66401af5.mp3";
export const mithaiR2HinAudio = "3e25eac5-b0e0-4beb-a792-704bd85f1b38.mp3";
export const nahanaR2HinAudio = "0a77ede4-2d39-40e7-9859-373fe3b6bcce.mp3";
export const ghoslaR2HinAudio = "d5562381-94da-4fc6-82cc-026bf975af4e.mp3";
export const khajurR2HinAudio = "8ef7eedb-5e12-4c79-805e-a7096edaa5a8.mp3";
export const mendhakR2HinAudio = "4de6276e-c55c-4920-a4c3-f32b50cf321b.mp3";
export const morniR2HinAudio = "d30337e8-25d5-47cf-ba8c-2dc1118d3ccd.mp3";
export const daudnaR2HinAudio = "9a7a46cd-333f-401c-9703-842d5ebd0efa.mp3";
export const anguthaR2HinAudio = "e9b593b6-02a8-47e9-8ab7-0193aecc9e8b.mp3";
export const anguliR2HinAudio = "201232ca-d934-4b4c-b393-3c4f61469b97.mp3";
export const kenchuaR2HinAudio = "ff6fd68d-5e69-4ed9-a763-37afb0eb41ce.mp3";
export const bhediyaR2HinAudio = "27946006-2a4b-4af1-8133-08436d90620e.mp3";
export const khidkiR2HinAudio = "d0da6c10-0340-4050-b814-809d2cde3934.mp3";
export const hathodaR2HinAudio = "7cf1fe30-8ea9-4397-ae70-455c98ae3400.mp3";
export const lakdiR2HinAudio = "52bbca68-16ae-4f98-a56e-9447c06809cd.mp3";
export const ladkaR2HinAudio = "47e8cbde-cfda-4ddd-a418-f062903c5bab.mp3";
export const inaamR2HinAudio = "a4013ff7-be66-470b-b940-10aa0a756161.mp3";
export const tirangaR2HinAudio = "ec6e57e7-3e08-403d-b480-80bca0988b29.mp3";
export const pagdiR2HinAudio = "1d66ff18-af13-4e15-bffb-6fea9f0f52c4.mp3";
export const bainganR2HinAudio = "f0944c1d-b01e-45cf-b24b-20ee7ad5789e.mp3";
export const parindaR2HinAudio = "529bf46a-5523-4d73-93bd-5334240e7b54.mp3";
export const chimtaR2HinAudio = "74b958e8-880f-41b0-abbe-0c2097d77312.mp3";
export const papadR2HinAudio = "1d851d91-fbf6-4a26-a5c4-62a7b852ef87.mp3";
export const bhojanR2HinAudio = "347bc65b-dba6-4727-82e4-de1cb45b0b7d.mp3";
export const kachhuaR2HinAudio = "282f6c70-5b86-4608-bdb5-eb1f45ac9ecc.mp3";
export const lekhakR2HinAudio = "fc8210c8-979f-471b-a5ad-8909b1cd80b2.mp3";
export const mareezR2HinAudio = "48ce1162-7d40-4511-ba74-5e7854d60e7d.mp3";
export const sainikR2HinAudio = "d7911098-c825-4910-8162-d43b664b0ac8.mp3";
export const gulabR2HinAudio = "8f386396-c49d-4884-98cc-eb4a19ba1a89.mp3";
export const machhliR2HinAudio = "c7cc33e8-e330-4376-a6ee-0780845487b0.mp3";
export const pahadR2HinAudio = "258565ec-146e-4aa3-ae32-fd16a9082c74.mp3";
export const kameezR2HinAudio = "f7427d16-d7d5-4834-a3d5-da3948eeb62b.mp3";
export const pencilR2HinAudio = "e0f07606-2d87-4c41-8349-3a538e1c2e56.mp3";
export const batakhR2HinAudio = "a8c69397-e008-4199-9964-4cae008520bd.mp3";
export const parathaR2HinAudio = "1b9c02f1-251b-4383-8e8d-ff9cb3944110.mp3";
export const sangeetR2HinAudio = "80cb28ad-71f6-481c-8f4b-27aa6cd0410b.mp3";
export const chidiyaR2HinAudio = "2e4b274e-b2af-4f6a-9db4-b77e6b1633ff.mp3";
export const dukaanR2HinAudio = "c36163df-3f0a-4179-995b-e0e14b00d5ae.mp3";
export const hansnaR2HinAudio = "b28a3a39-2eef-4950-9828-1d48e956ab38.mp3";
export const jamunR2HinAudio = "0da28def-727d-4f6e-bfd1-0a93e02313c8.mp3";

export const AndadaSaraBeautifulNecklace =
  "ddf58b20-f614-4792-bf17-0a849a6cd6f4.mp3";
export const Peas1 = "4fd2b011-dc23-46dd-a1e3-bc388fbf9b2.mp3";
export const Peas3 = "ea932e4e-2a15-424d-97d2-4db4ee065816.mp3";
export const Peas2 = "e097cb83-eb29-4164-b6f7-4c8b5bdacd47.mp3";
export const Peas = "18ea6fc4-1752-4f4a-a3f2-eeefd0e2a3b7.mp3";
export const Ravi_Sun = "95535ab8-48e5-4709-8765-dce5d02560d1.mp3";
export const Cauliflower = "8e9d8c64-2aad-4d24-bef8-77c88842ef9b.mp3";
export const Cauliflower_1 = "8cd482c7-fd01-4305-8326-8f858b3eafe8.mp3";
export const Cauliflower_3 = "96cd158d-9786-4573-bed0-a5555d82feeb.mp3";
export const Cauliflower_2 = "0dfca25d-78fe-44bf-b0b7-618b6f879cc2.mp3";
export const Parijat = "afd5720c-80b8-4b58-95d9-2343a24ebc80.mp3";

export const parijataImg = "c5990fac-5cca-4d69-b82d-a9ea5434a8c5.png";

export const respectR2TamImg = "a5ea8ed1-65c3-43dd-ba04-b1de44662514.png";
export const boatR2TamImg = "f776d9bd-cefc-42cd-aa72-7b8af09bd841.png";
export const prayR2TamImg = "ef4eb62c-d278-4ff6-8057-c4a9f11a080b.png";
export const towerR2TamImg = "fe4433a6-91d8-4e65-a8e4-1918e251f4fc.png";
export const cityR2TamImg = "493b39c7-b2b1-423e-980b-6e426647258b.png";
export const kingR2TamImg = "8edd53ab-c4d1-4c10-9db1-c23b4c027987.png";
export const earthR2TamImg = "7eaa115e-17d2-4f06-aba6-65ac3a69f8c2.png";
export const barberR2TamImg = "577f7ebe-320f-4efb-b023-dfba7f5d901a.png";
export const poetR2TamImg = "e0d62b53-9a9c-46b3-ac09-3ad1f9903641.png";
export const merchantR2TamImg = "9845d678-7ba8-4f1a-8a91-2da7cefa4ac3.png";
export const telephoneR2TamImg = "dab22341-26c9-44d4-9bc8-c97498032baf.png";
export const computerR2TamImg = "b885dd60-87ba-4589-af3a-a05b4c740a18.png";
export const bangleR2TamImg = "0df598fc-463a-483a-ab3a-8079aca3c7c4.png";
export const officerR2TamImg = "0c0b49d3-b58e-436d-b170-8414f0c8ea7a.png";
export const featherR2TamImg = "a96d785e-75eb-4045-9572-e71fe3aabce2.png";
export const wheatR2TamImg = "4313f849-26ac-4238-b9a1-c23eb625dd7b.png";
export const speciesR2TamImg = "4ea96f68-7dbf-49ce-adec-bda26ac2b550.png";
export const shapeR2TamImg = "3ebc4675-798d-4783-a341-3f58edfed21b.png";
export const farmerR2TamImg = "cb373908-32f3-475f-982f-a889a94d831d.png";
export const artistR2TamImg = "54e8a45a-6673-45ef-9b34-c88cd4feb576.png";
export const pillowR2TamImg = "a3ca0399-cd00-461b-ae61-b33fc24f4381.png";
export const societyR2TamImg = "781af2e0-2377-4ac7-af9c-f36f56297989.png";
export const eagleR2TamImg = "afed6a19-0567-4960-a547-cba488aa0036.png";
export const aeroplaneR2TamImg = "e0c5e6b1-bfb0-417a-ac61-6757ba286bea.png";
export const bigR2TamImg = "11a0f856-d437-42a8-a684-4aa4b5f34c18.png";
export const coughR2TamImg = "cebbe900-6a68-4d0d-aa3a-7077f8ddf539.png";
export const armyR2TamImg = "1319fa36-d46a-430f-abfa-de0452f6c42e.png";
export const achievementR2TamImg = "6663111d-4879-4403-8751-01420c7089cd.png";
export const studentR2TamImg = "1996c669-25f5-4ca6-b8fc-f8aa4d5539cc.png";
export const potterR2TamImg = "002a457e-28a9-4117-8827-14b78605eec2.png";
export const cuminR2TamImg = "afeeb9ec-1a8e-43cb-97d0-c51c99d00fd9.png";
export const mathematicsR2TamImg = "a5961e56-f236-42c0-b47a-6f73a2fda822.png";
export const singerR2TamImg = "7091d3f1-eca7-4af6-81ed-cd35e3fb2690.png";
export const lipR2TamImg = "d198c6e5-1c75-484c-9d63-24894d76c87f.png";
export const letterR2TamImg = "787d670a-a112-402d-9553-b42869b3de54.png";

export const singerR2TamAudio = "7fca32dd-5824-4b09-90ee-94ac7eed2481.mp3";
export const societyR2TamAudio = "e08a81a8-7976-4fe2-a747-b3152c235ba8.mp3";
export const towerR2TamAudio = "e2f4b58a-f47a-4562-87b8-d87bbb4d0299.mp3";
export const letterR2TamAudio = "33930796-06da-4fec-b679-261f9ca4ceb3.mp3";
export const potterR2TamAudio = "fb15f95c-3ebd-408a-96e4-0246a5e603ac.mp3";
export const poetR2TamAudio = "e292bc5e-ebe0-4798-9281-30cd1385673f.mp3";
export const bangleR2TamAudio = "74bc492c-2fc9-46bf-972b-4a3b193ceb96.mp3";
export const boatR2TamAudio = "2539d84f-2aa8-4b8a-a0b8-f82dc618835a.mp3";
export const telephoneR2TamAudio = "bbba7bdd-11ad-4305-ac9f-3693284ece79.mp3";
export const barberR2TamAudio = "87e9ccd5-ffd7-44b5-9251-7d82804bcab7.mp3";
export const aeroplaneR2TamAudio = "e5507984-0b28-4ebf-bea4-dd1c34611f19.mp3";
export const studentR2TamAudio = "ec00a177-663e-42d6-a523-2dd4d591d9b9.mp3";
export const cuminR2TamAudio = "80e8991b-54fc-42d2-9c67-d86f5f88c185.mp3";
export const wheatR2TamAudio = "21c6c1c2-3ce0-4d40-a129-d9b16745e3c9.mp3";
export const grainsR2TamAudio = "8c21f6f2-e0ea-490c-ba8a-f02d93a5d264.mp3";
export const speciesR2TamAudio = "2bab81e1-48a3-43d8-8e39-40269faad158.mp3";
export const officerR2TamAudio = "29fa71ad-713f-4d03-bec6-fb06a488915f.mp3";
export const bigR2TamAudio = "92c83a2b-137d-4f33-908a-6444ee2d178a.mp3";
export const coughR2TamAudio = "6d00e6dd-7b7c-4bd0-bd51-f1938742d8e4.mp3";
export const cityR2TamAudio = "be73ab0d-2722-4c4a-8731-eb5d39d49074.mp3";
export const merchantR2TamAudio = "70b142fb-dc9d-4416-ba32-3d9319df94b8.mp3";
export const shapeR2TamAudio = "bb989ba4-869c-4481-834c-8dc810642e20.mp3";
export const armyR2TamAudio = "40cd2a4d-ce00-4a1d-8829-b48da34c3dd1.mp3";
export const achievementR2TamAudio = "9d97b714-2741-4277-a600-023c7ac69d6a.mp3";
export const artistR2TamAudio = "2c3f0cc7-669a-42ea-a594-16921473da02.mp3";

export const humanR2TamAudio = "99a8537d-486d-45e2-9dfb-8f5c1f4d482a.mp3";
export const frogR2TamAudio = "80a15371-f2c2-419e-9398-4fa894974e08.mp3";
export const oldR2TamAudio = "088c23fa-e18c-4b63-b048-df1ae86c3e05.mp3";
export const donkeyR2TamAudio = "1c14d32b-2245-423b-a57e-fda57c0e4964.mp3";
export const sunR2TamAudio = "3d62d3cb-53c3-42d6-a1df-4638d3c3c042.mp3";
export const ringR2TamAudio = "2f1cb97b-881a-472c-88bb-0404adc612f2.mp3";
export const bearR2TamAudio = "c89531a2-0711-4531-bcfd-5ec532b12a2b.mp3";
export const fruitR2TamAudio = "bd82c929-561b-4f46-98e7-0a34072401c5.mp3";
export const slowR2TamAudio = "72515c81-5c72-4c28-a1ba-ade7ed5fffb5.mp3";
export const tabalaR2TamAudio = "a09f5fba-ff5c-4448-81e9-74c003b5e917.mp3";
export const hotR2TamAudio = "a37be1e6-5b97-430a-8c4c-a818c41ef528.mp3";
export const chilliR2TamAudio = "77d0e6e2-d49a-41af-8ebd-06a1cece62f3.mp3";
export const birdR2TamAudio = "e6550a37-7df1-4a9d-8f18-340b6b8a0498.mp3";
export const danceR2TamAudio = "15325aad-cfca-4aab-a1b9-5c8251b5a3f5.mp3";
export const eagleR2TamAudio = "12414acd-d597-43e0-b6cd-f61a9e066459.mp3";
export const computerR2TamAudio = "b6f9487d-2ce8-41ba-bf54-a993d2b217f2.mp3";
export const lipR2TamAudio = "b1aff71c-104d-460c-8da0-89ed40132758.mp3";
export const earthR2TamAudio = "0c4630bb-b8fc-44da-a417-029fd0975570.mp3";
export const farmerR2TamAudio = "14732853-a3f4-45e6-8c8a-47fb4596c7f4.mp3";
export const featherR2TamAudio = "c36eb6e0-18af-4efe-ae75-0fb155268e3b.mp3";
export const pillowR2TamAudio = "c9207b78-8567-4341-af35-7788cdde4607.mp3";
export const kingR2TamAudio = "8b612f2f-152e-43a7-86ac-1a9e030cfc0a.mp3";
export const prayR2TamAudio = "80708886-1aa0-4ebc-8a4b-38226fc47df5.mp3";
export const respectR2TamAudio = "643d5ea6-ed0b-4100-81e3-72b355758563.mp3";

export const musicR2KanImg = "a5c92b7b-e4df-4da5-b0ec-873b9f5e3001.png";
export const rangoliR2KanImg = "8c4e751c-6147-41e9-816c-e1bc28d5d5cd.png";
export const soapR2KanImg = "96f6fdfe-1a51-41b5-99e4-5e5a9037b4f6.png";
export const marriageR2KanImg = "442692fe-b7ab-4371-9e6f-ab8e8573aaab.png";
export const hairR2KanImg = "36d5133f-0382-4083-bf55-426dab1b4b56.png";
export const bearR2KanImg = "8751cf9c-8e67-40fe-8ace-9d8c3b8e8582.png";
export const respectR2KanImg = "8164e456-adca-42bf-8665-3843ef4d8aca.png";
export const kangarooR2KanImg = "4cf28994-8cbe-4459-9819-de8708a900bd.png";
export const fryingpanR2KanImg = "ad736700-2fbe-4d90-a5e9-d64b07992b48.png";
export const monthR2KanImg = "01d80c88-a855-4e44-9e92-83bc8a5f30f9.png";
export const cauliflowerR2KanImg = "61fe3949-cc4b-475a-9461-4859bec72562.png";
export const towerR2KanImg = "0476f2bb-703e-44bb-84b3-f73c938b89a1.png";
export const bucketR2KanImg = "432119c0-ca25-4279-80f0-6aa6a2caf273.png";
export const vehicleR2KanImg = "db5a3a5e-e2ea-4d5a-b96c-142cc40982c8.png";
export const spinachR2KanImg = "e00ac999-cb78-4bdc-aaea-265107acf76d.png";
export const nailR2KanImg = "667efae8-3a55-4a45-a642-0ce06301bd00.png";
export const societyR2KanImg = "400ef6c7-8d4c-4294-97d4-9a8192176cd6.png";
export const bedR2KanImg = "2d06dfb8-c701-48dc-b5a7-79ee6b00fbe5.png";
export const tomatoR2KanImg = "a1f30018-f617-4856-9385-12639919454e.png";
export const fluteR2KanImg = "355fc829-b62d-4be7-b5b7-bc626b631d4c.png";
export const happyR2KanImg = "21ad9e99-8c52-47c6-9f77-0320aa332fd4.png";
export const cheetahR2KanImg = "259eb208-95e4-4360-8223-666b9abbb3b0.png";
export const giraffeR2KanImg = "b5e6e73c-c115-4b90-a44f-3e13fddece8d.png";
export const greenR2KanImg = "5e24cd8b-ccd5-475e-b347-f9e5120302eb.png";
export const horseR2KanImg = "e0a23dba-5f26-42ef-bbc3-35791a11d75f.png";
export const aeroplaneR2KanImg = "dc9a6844-ea37-40f5-b47f-60b04b52e4a0.png";
export const raddishR2KanImg = "b3b23fc5-710f-4391-8e9f-c642bb2d8e85.png";
export const girlR2KanImg = "5669973a-d3ba-4ecb-8967-7f86d262a2f6.png";
export const weaponR2KanImg = "cbd3c38e-bd61-48a3-8091-ec913e51072d.png";
export const toungeR2KanImg = "ddb055d2-1d91-4631-a996-caa872aaab48.png";
export const doorR2KanImg = "5d08bc9d-6504-4d1a-8e95-a17ebb2310dd.png";
export const curdR2KanImg = "30f64cf2-30a1-44da-9237-5ecafd894ec8.png";
export const agricultureR2KanImg = "4fb012ed-a701-4b57-b98e-d5d84e7c7371.png";
export const deviceR2KanImg = "85a71ab5-46a6-4155-b21e-5f13bef15874.png";
export const officeR2KanImg = "fec818f8-6ba5-4963-90ee-2752de14f7e9.png";
export const roseR2KanImg = "1631e92b-9606-4ad0-ad61-8335eee4e5ff.png";

export const WeaponR2KanAudio = "f70c0fab-258d-4513-acd2-fcd8447b54c4.mp3";
export const HorseR2KanAudio = "2e9ef4a6-3775-4d43-8eb6-ce21b2710d2c.mp3";
export const GreenR2KanAudio = "e03ef34a-a988-4d79-a669-9d733c5eed04.mp3";
export const OfficeR2KanAudio = "92bb3111-6bed-4e97-b08b-1de15c55c570.mp3";
export const DeviceR2KanAudio = "1c63cd5b-6a58-4c0f-b9e8-4fbfd6560a17.mp3";
export const RaddishAudio = "a8122fa5-5d5f-40db-a52f-440c2491f7f5.mp3";
export const ToungeR2KanAudio = "3e6bc4e7-1911-4ce5-ac9a-37e533898393.mp3";
export const CurdR2KanAudio = "1c4a3426-9e76-417b-914d-19b1d05772f8.mp3";
export const DoorR2KanAudio = "deb51863-becc-40d0-9a46-a874abf9900f.mp3";
export const RespectR2KanAudio = "e4cddfd4-b275-4be9-81c0-9cafd391367f.mp3";
export const KangarooR2KanAudio = "f55b54b8-0803-409c-93eb-2ae4aa212be5.mp3";
export const FryingpanR2KanAudio = "b85baef7-6b30-4f87-90f7-2396a24a23fb.mp3";
export const HairR2KanAudio = "2063b916-3d67-4d1c-b564-021f41bff3d5.mp3";
export const CauliflowerR2KanAudio = "1d86646e-1fd7-4e23-9eeb-35428ea4a805.mp3";
export const MonthR2KanAudio = "37b39107-f1a8-42e4-9ffa-cd1313f5509f.mp3";
export const MusicR2KanAudio = "f0ffbc48-79e9-4542-80d7-b63c3881aa7e.mp3";
export const SoapR2KanAudio = "56ed4549-990c-4dfd-8f14-2d9f049f14fa.mp3";
export const MarriageR2KanAudio = "a54858ea-9bb0-4aa7-a22d-3604285df92d.mp3";
export const HappyR2KanAudio = "b0e2c372-db01-4699-b5ea-a259b252382e.mp3";
export const GiraffeR2KanAudio = "0b24e533-ecac-4348-817e-60b432710c08.mp3";
export const SpinachR2KanAudio = "973f7bc1-a397-4fd7-8120-9e5607ba0d56.mp3";
export const NailR2KanAudio = "41a2be63-7de8-4b21-b3e8-ffe388441e1a.mp3";
export const SocietyR2KanAudio = "b513c32c-bb14-4c84-b708-bde69944dd99.mp3";
export const BedR2KanAudio = "87f9176e-6807-455a-9ca9-fb44e844935e.mp3";
export const TomatoR2KanAudio = "0bbd6652-4d8d-42ea-b2f6-937dab9f195e.mp3";

export const girlR2KanAudio = "78ec7b47-60c9-470c-ba11-185c9c78203b.mp3";
export const towerR2KanAudio = "bcadb2da-5fec-4330-941e-88969001b1d9.mp3";
export const cheetahR2KanAudio = "e70cfbc0-bda7-4462-b06e-016c4004a60d.mp3";
export const bearR2KanAudio = "d614a927-2e66-46b2-b6bd-2ec8fa429b80.mp3";
export const bucketR2KanAudio = "da86ccc6-6a40-4e41-ade4-3cd4ac907f8b.mp3";
export const fluteR2KanAudio = "2ddea481-1720-4bc0-93ca-262fa7a6061d.mp3";
export const rangoliR2KanAudio = "9ca0d5c2-c813-4743-813e-d2f601edfc2c.mp3";
export const aeroplaneR2KanAudio = "37a79c56-6f59-4953-85f3-9a9e6c61db9a.mp3";
export const agricultureR2KanAudio = "a1122d56-af9b-4eed-9dd3-f618f630f996.mp3";
export const vehicleR2KanAudio = "72a3db29-217f-4f07-972e-f8083dff4efb.mp3";
export const roseR2KanAudio = "9eb48eef-a245-4ea3-ad1f-e804e86e7057.mp3";

export const umbrellaR2TelImg = "bc757879-2cff-479f-bc2c-f9b678b524a6.png";
export const mangoR2TelImg = "04904024-dbab-4c4e-9aac-b5b17e4c78ce.png";
export const boilR2TelImg = "37d7fa25-922b-4afc-8500-35a6bb0c3e35.png";
export const tortoiseR2TelImg = "e46bf15b-5754-4454-8923-b8822e43db36.png";
export const coinR2TelImg = "510b3f39-bde4-467e-8739-323238d34627.png";
export const chapathiR2TelImg = "4b84537c-0167-49a8-824e-b6817d1737a7.png";
export const tallR2TelImg = "fa272969-1024-47bb-80a3-21fc4712ee7c.png";
export const pineappleR2TelImg = "9ad695ad-4a0a-40f7-873b-45653a2e7424.png";
export const readR2TelImg = "9393eada-d722-42b8-b136-dc8caf36935e.png";
export const pondR2TelImg = "bb48e753-9b86-4b97-b560-fd4d07e146c3.png";
export const countryR2TelImg = "7381f40a-d346-409e-9a17-76a0e02e536b.png";
export const lipR2TelImg = "efad8754-c71b-4968-b3cb-e779a000ab1f.png";
export const sweetsR2TelImg = "df4ad102-fadc-4e31-9ae7-5bf0bac63176.png";
export const lightningR2TelImg = "85f32ebc-6193-4b0d-8f27-598066bfe855.png";
export const barkR2TelImg = "64b6c023-1806-41b2-b81d-c331fb457879.png";
export const broomR2TelImg = "3ce28425-87b3-4956-8b9c-73e5af0dd971.png";
export const foreheadR2TelImg = "ecf09154-7b11-46d6-a6d7-43bbd3eaebc3.png";
export const drawR2TelImg = "815416f3-53ac-4ccf-8d2c-3123b86364dc.png";
export const radioR2TelImg = "c9bea5ef-0268-4501-b40d-fcfb9a743b38.png";
export const hutR2TelImg = "6f637a9d-ee57-401e-a31c-ec388a039e65.png";
export const ironR2TelImg = "1c836443-5b77-4d53-91ac-4fbb481f1715.png";
export const wolfR2TelImg = "00b32a22-ce82-4ab4-96fb-ccd3201c43ab.png";
export const jamunR2TelImg = "5740df4f-0bee-4589-b9b8-a79bc2961df5.png";
export const policemanR2TelImg = "7b2339d5-987a-4c80-bcce-7a244531a74d.png";
export const wheatR2TelImg = "12e1d277-872c-4be8-bbe5-e817c2d84960.png";
export const giraffeR2TelImg = "9a9e3de9-caa5-43bc-aba1-e3c63917de4d.png";
export const happyR2TelImg = "1f4fedc3-2433-44c4-9540-3a9902b9b1e7.png";
export const babyR2TelImg = "ff77b262-c3a8-4fc9-9ece-64cb31ee1796.png";
export const familyR2TelImg = "333ef2d2-b098-4e24-a4d2-3c138ab5f4ff.png";
export const guestR2TelImg = "f8c2d7e0-6ce8-40ca-8511-ba188f11cd80.png";
export const skyR2TelImg = "6c8432b6-c11e-4464-b048-f7ff464044e4.png";
export const papadR2TelImg = "bc4e7e75-4abd-4059-9c29-201e1bb68ff0.png";
export const mealR2TelImg = "ffea7aa8-55e1-4339-8f77-74eac1c8e77c.png";
export const hibiscusR2TelImg = "bb2f33a4-f206-4080-9ba2-d77d00a73ab7.png";
export const throatR2TelImg = "ca18a4bb-055b-47cf-a36a-b6ba75ca51c7.png";

export const lipR2TelAudio = "6b4f98fa-31be-4940-832c-6ae05a0b7ba3.mp3";
export const barkR2TelAudio = "ed31bc0a-5348-4806-b6f0-9c7ddad67327.mp3";
export const radioR2TelAudio = "56114314-a013-4086-94d4-bb962253d8d1.mp3";
export const happyR2TelAudio = "a32af2f4-1a29-43b6-b804-d325b1568840.mp3";
export const wolfR2TelAudio = "d0b47806-00ed-4f3d-9257-d94fb9e14ed4.mp3";
export const coinR2TelAudio = "4c0c37d5-1e0a-4a2c-af97-0a5cbf91e2e2.mp3";
export const papadR2TelAudio = "0d2128ce-8685-434d-b2ce-26dd562638f6.mp3";
export const babyR2TelAudio = "988dc543-287d-4058-9401-2e971440b5e3.mp3";
export const tortoiseR2TelAudio = "b2eee9c7-f84b-4562-83eb-ce15af5c4f94.mp3";
export const hutR2TelAudio = "0a1f7c82-b47a-458a-934f-9c73aa8c283e.mp3";
export const mealR2TelAudio = "07d289dc-b7b1-4416-a386-33a0d906e7a3.mp3";
export const ironR2TelAudio = "e097953a-4d05-470b-a612-e222515175fb.mp3";
export const readR2TelAudio = "790059b9-3209-4312-b184-e9648787deaf.mp3";
export const wheatR2TelAudio = "fc402f45-79c3-4b77-b599-4b69daa1a29c.mp3";
export const pondR2TelAudio = "6ce2a2eb-a6c7-49d5-8b89-815fa4eb4dcb.mp3";
export const broomR2TelAudio = "5382195b-41f0-4a78-a3d3-36577ba3ba94.mp3";
export const guestR2TelAudio = "940e5aec-4c8c-41ff-8e74-1b6ab097eeec.mp3";
export const countryR2TelAudio = "692ca85d-46ef-4826-b98f-f019b9643a9f.mp3";
export const lightningR2TelAudio = "7db2d6a7-edff-4b7b-8422-5e953a117201.mp3";
export const jamunR2TelAudio = "569f5939-d333-4def-b180-7c6c4ab850f8.mp3";
export const tallR2TelAudio = "ef942313-8bb8-4c7e-89e1-98c2a70ac32a.mp3";
export const throatR2TelAudio = "1c6e8a52-da75-4a6e-bfa2-e284d2213bb2.mp3";
export const skyR2TelAudio = "0ab4a0d5-077e-48a5-ba6b-2a1dfcfb8a20.mp3";
export const foreheadR2TelAudio = "c72ce587-5dfe-46d6-b115-2529b8ecf29e.mp3";
export const drawR2TelAudio = "ecdc9046-b48f-487f-9d89-b2bf4dc20065.mp3";

export const mangoR2TelAudio = "5e1f2c17-829f-4db7-bd51-a475be0a37b6.mp3";
export const giraffeR2TelAudio = "e3d0e4e6-3526-4de5-92d9-172f80bb697b.mp3";
export const policemanR2TelAudio = "ab081155-db1b-4b57-8d88-08ae4eb70138.mp3";
export const sweetsR2TelAudio = "30ea52af-8400-4480-811e-b560c07a5a5f.mp3";
export const pineappleR2TelAudio = "e836ab15-7a65-49c4-b27d-380969f5da6c.mp3";
export const boilR2TelAudio = "8076cb27-4a9c-4429-8c35-b3f0f79517c4.mp3";
export const familyR2TelAudio = "1a920667-bd73-4d37-ad15-59af1ae42ac3.mp3";
export const hibiscusR2TelAudio = "0f89721e-75ba-456c-a0d7-905719cac46c.mp3";
export const chapathiR2TelAudio = "2d29f66a-3273-46c1-a21c-bddd8b064ef7.mp3";
export const umbrellaR2TelAudio = "5254d658-ba62-4277-968f-94cbd2f388d4.mp3";

export const street_M1Audio = "618a3e45-3f54-45c8-bae2-052af0d54275.mp3";
export const thread_M1Audio = "55a68efc-032a-4320-b0c2-857d17cd6567.mp3";
export const jewels_M1Audio = "e86fb74b-cbb0-437c-b19e-61001954f9d2.mp3";
export const garden_M1Audio = "d706ae2b-412b-4287-804c-adeb8c137249.mp3";
export const stomach_M1Audio = "eba973fb-fd58-44fa-bd37-bebaa450ca27.mp3";
export const brush_M1Audio = "8dbed3c0-b222-421e-897d-e72b37aa95c3.mp3";
export const school_M1Audio = "9a468173-9464-4e4c-ba2b-ee8dd5c3391d.mp3";
export const head_M1Audio = "c915d29e-ffe6-44c3-af90-86fba1c060dd.mp3";
export const wall_M1Audio = "e677a85b-c000-4d28-9cf0-17b609d307b6.mp3";
export const floor_M1Audio = "67134cd3-1a80-4cfb-b6ec-487484633c7a.mp3";
export const red_M1Audio = "abe754bd-fcf4-4449-b20d-e00ad1eee930.mp3";
export const ball_M1Audio = "07cb6d06-1daa-42bc-bcf6-9995df9606d5.mp3";
export const coffee_M1Audio = "5dc7eb65-b075-4b4a-a6bf-887a87cbc813.mp3";
export const black_M1Audio = "5224e787-225e-42de-835e-b8c63f99d870.mp3";
export const dream_M1Audio = "455bd4c0-f4c3-4360-aac1-ddf8f5d1b501.mp3";
export const fly_M1Audio = "e411eff4-88b4-461b-a5f1-600d89cc944d.mp3";
export const banana_M1Audio = "5ca1271d-cf7b-4163-9adf-a8dfc8a9b414.mp3";
export const room_M1Audio = "629d7a16-e2f4-4777-9f30-2a590a099172.mp3";
export const garlend_M1Audio = "3d219ae7-f650-4859-8296-b5caf3103485.mp3";
export const paddy_M1Audio = "f75df484-2b1c-4bbc-a20f-0f250769fd58.mp3";
export const river_M1Audio = "27e5609d-705a-44ad-b166-2db640edfc11.mp3";
export const lamp_M1Audio = "ce993498-f475-4afa-8e17-9cd63e961024.mp3";
export const swimming_M1Audio = "a1740f7c-ff62-45b8-823a-8e5c66b42f78.mp3";
export const city_M1Audio = "ded1136f-303e-498b-8ea0-6f565d794f00.mp3";
export const sand_M1Audio = "6065480c-aa55-465c-bb92-b64fb9deef4e.mp3";

// --- M1 Image Assets ---
export const boatImg = "9d2eabf5-24b0-47a4-a54f-e9a9b9f31ede.png";
export const hotImg = "bc17d3ed-8488-4586-b8eb-b36341fdegta.png";
export const coatImg = "9323166f-6d60-40af-9ceb-5b5f680eb22c.png";
export const toadImg = "9323166f-6d60-40af-9ceb-5b5f680ebgt.png";
export const bikeImg = "78968339-952e-457c-a68c-375db87cb8b5.png";
export const catImg = "669026ee-9d82-42d9-94ed-ecdaf3d07547.png";
export const tapImg = "0de61ce1-e518-42b0-9232-3f9310e05778.png";
export const matImg = "ef8f962b-bf11-4d89-b6a6-24153bb8d68f.png";
export const potImg = "d8988fb3-d7b0-447a-8b02-0b8c6f66ab4c.png";
export const godImg = "d342aefc-eeff-40f2-8af0-bfc41cb4995a.png";
export const cookImg = "89b151f8-6259-4051-a464-b6f1b962ef34.png";
export const godImg2 = "6027bb6f-bc4b-4842-8cf6-3c37192919a6.png";
export const badImg = "2f6bc668-91bd-465f-ba01-e854d5c4b8c2.png";
export const momImg = "f4f9a859-b383-4a4b-a40d-967351614be3.png";
export const goatImg = "a2d64265-22b7-4906-98fe-cf4c0e9e9ed1.png";
export const hopImg = "e404b255-0604-4652-9299-7d761f29b047.png";
export const fatImg = "3dfe9029-e0cf-4d39-aee5-ee5cfad15580.png";
export const sadImg = "b76bd8fe-89c1-423b-9d8f-ab1bdab7fcb6.png";
export const nineImg = "877277bf-dd40-4312-acae-446b6a4fcfe0.png";
export const himImg = "a74a1706-2c96-4235-a8ee-32c9df6026ea.png";
export const toeImg = "a4759ed3-7743-4500-9958-03dd150d1a58.png";
export const binImg = "1f946fa4-bbf6-4b61-b058-06e6674751db.png";
export const packImg = "bf1d19f0-96a2-46a6-baa3-506ffc077ad1.png";
export const tieImg = "6c6922b7-dfa6-4a4b-b511-41a746d9cfef.png";
export const pineImg = "314c1c00-22a1-4124-af61-b4df6b851ec6.png";
export const timeImg = "3dfdfae0-25c9-49fb-86aa-1a98fe1249b0.png";
export const palmImg = "b14411bc-36d3-4c38-a3fb-3086113fdb1b.png";
export const nightImg = "3bffbf19-5d6a-469f-bdff-745f28f53762.png";
export const pondImg = "ea845eb1-3de5-4fe3-b0ac-649b8a68b001.png";
export const pitImg = "c84d2e41-975c-4327-b421-5b220f2b998e.png";
export const wideImg = "1356cd53-a2a7-44fe-95ea-7e382167b98e.png";
export const noteImg = "8df1cd15-ef0b-453c-a9df-0093e9cdfbf5.png";
export const buyImg = "28c69ac5-99d0-4383-9edc-8d146c727fdc.png";
export const happy2Img = "c921d759-2e26-41ab-8eff-7dab01089235.png";
export const fineImg = "0c70fa06-e840-44dd-b726-d1765b6d29a8.png";
export const kindImg = "bc05d7a4-fa9f-4caa-8100-ab9b7a66ae8f.png";
export const bodyImg = "e9b350a8-3952-4e0c-a4a1-d45f3aa21aa0.png";
export const halfImg = "345527ab-3b8c-4b71-9543-24fc3da16eb7.png";
export const hideImg = "2d18a725-3c93-426b-a4b4-5d51f2a7e072.png";
export const knowImg = "38b6da3c-4d1f-46a9-babe-75cd84837dca.png";

// --- M1 Audio Assets ---
export const boatAudio = "e0fb7881-3ede-4f97-b45c-7a3ce706c81f.wav";
export const hotAudio = "8d7b152f-29bd-4e1b-a71c-dae0e39f66f8.wav";
export const coatAudio = "f7bab794-a22c-4e3e-a930-857e994f98d7.wav";
export const toadAudio = "e0bb80da-0dd4-4d0d-af0b-d1dccf8198af.wav";
export const bikeAudio = "bd925d37-0a89-4129-8190-85cf933dabaa.wav";
export const catAudio = "4a49589b-cb3b-4fd3-8b2f-49f02c5099b1.wav";
export const tapAudio = "067ff37a-2d3a-49b7-95c9-0af1b3d041d3.wav";
export const matAudio = "3b66c4ec-a05b-416f-9da8-579247c18c87.wav";
export const potAudio = "d207b815-c3d8-4dd8-91d9-7e19a9114855.wav";
export const godAudio = "4bba6816-1033-435d-b560-43d27932ffb1.wav";
export const cookAudio = "4e5dceb9-e09a-4ab2-86b3-bca2d56d348d.wav";
export const godAudio2 = "cbf8a4e1-2bf5-45fb-a8b6-816e3c7355ba.wav";
export const badAudio = "4b2f1515-4d2f-4058-8e25-7c90b5d662c0.wav";
export const momAudio = "1c2e0eff-c9be-4934-9e08-f8e0bb2c2537.wav";
export const goatAudio = "398bd1df-49db-4b70-af46-1640bcedcaa5.wav";
export const hopAudio = "31fe0bd9-8efa-4d35-80e2-e41348d8fd7e.wav";
export const fatAudio = "97fd4d2b-19e7-4b21-8748-be3c21425d20.wav";
export const sadAudio = "5ddd4f36-8465-4be1-94b1-82ee7140db0d.wav";
export const nineAudio = "68c2e49b-4fde-41de-a24f-e6e71f0bcff4.wav";
export const himAudio = "72162bd9-78a4-4bec-9b2b-a3412bf1e812.wav";
export const toeAudio = "6b346588-d72d-44c3-9593-d122f797a76e.wav";
export const binAudio = "f5d21d68-feed-4c30-960f-7fad2e8cf5d9.wav";
export const packAudio = "02dc45a0-e267-404f-ae46-1a12f957f06f.wav";
export const tieAudio = "3b5bc716-90f2-4a9d-967f-80f86a4cfdd1.wav";
export const pineAudio = "5b52f229-5a4e-4d65-9be3-508e3117e397.wav";
export const timeAudio = "cce043b9-e7d0-4091-b0a1-57f06a7db564.wav";
export const palmAudio = "31470729-9d56-43ec-9fc9-14c3c47f69ea.wav";
export const nightAudio = "43759f4b-23d9-4175-ba43-bf9228b55247.wav";
export const pondAudio = "66e41234-9c49-4eec-9a4c-4604dfc5ee4f.wav";
export const pitAudio = "2b623997-28ec-44bf-ad17-496d2a141933.wav";
export const wideAudio = "d3157b1f-dcbd-4a40-a357-8d9f04a59201.wav";
export const noteAudio = "9df6197d-3998-4a2c-93c0-4c6c2103cb98.wav";
export const buyAudio = "6fe6e24a-0827-4fc1-86ee-b056dd11fe77.wav";
export const happy3Audio = "ef03581b-6149-498c-a9c7-03e70253450e.wav";
export const fineAudio = "c1aca924-7d8a-4f92-8048-a243865158aa.wav";
export const kindAudio = "62d1ec36-8d45-4f57-9e80-d58fe33c3303.wav";
export const bodyAudio = "aa307a2d-0110-439a-81ff-95d4c9c40bba.wav";
export const halfAudio = "3858acad-b07b-4d43-950c-5efe51aaaddc.wav";
export const hideAudio = "966ec4a2-c16b-4072-b2ce-87d53e45bc35.wav";
export const knowAudio = "26f23831-c18b-495e-9e3e-674833c4eecc.wav";

// --- M2 Image Assets ---
export const mathImg = "f83023b0-7244-489c-9fd7-426aa1f4ce67.png";
export const breatheImg = "cbf5d3fe-1dc6-42aa-9a12-45158c505e90.png";
export const jumpImg = "77bed8c0-f1de-4e0b-b18b-94645ec62476.png";
export const singImg = "deb70f14-4060-411b-9a13-53fca93fb2ff.png";
export const ringImg = "f87a7d04-42b1-4ddd-8f2d-e33eadbeefff.png";
export const pathImg = "f7ce84e4-f6a5-473a-adf8-6c90050f5db6.png";
export const wingImg = "654d58ee-8c61-434f-9473-1529e34963bc.png";
export const furImg = "9e98be05-5315-4dc8-9101-043d74051673.png";
export const runImg = "46f0c0e5-0a88-4d2b-bc45-1ae7bf5828c0.png";
export const birdImg = "0a21dabe-9991-4064-b1c0-39f74583fd7a.png";
export const sonImg = "3d03ea61-16c8-4b0b-982d-160b7a53bc76.png";
export const chairImg = "e3c0b9cf-5468-4b9f-92e9-74131d2b6d19.png";
export const fairImg = "a2b60d70-a9fc-43ef-985f-02772f7eb17b.png";
export const zigImg = "aa3b8604-980e-4c54-abb4-d8c86b11987f.png";
export const chatImg = "3838fd81-df20-4d6c-a3ec-81cf065bb303.png";
export const logImg = "e34d9e7f-22c1-4c28-b7cb-545a60a42c32.png";
export const birdImg2 = "748f0beb-c682-4cac-8423-a96789d3fad1.png";
export const pen2Img = "060a53e1-16ad-4f6c-89b6-73f63b2ecf50.png";
export const nowImg = "7f223b89-9b43-48d5-8ebb-04065be15bea.png";
export const careImg = "3ff9d1a7-bf17-4460-82c0-4566a6869613.png";
export const threeImg2 = "dfe3f13d-a628-4257-b6f4-65a0e65890de.png";
export const riverImg = "0688268d-461d-419a-acbf-fe3f09ebdb99.png";
export const thumbImg = "b54c74f1-1b02-440b-adb2-f8a9a5e454e4.png";
export const earthImg = "f9af0b53-e0a6-488a-a6d0-580cae4c6f8c.png";
export const magicImg = "f9af0b53-e0a6-488a-a6d0-580cae4c6gta.png";
export const mother2Img = "b99f2164-3289-41ae-b1d1-4fd340c5f176.png";
export const fatherImg = "ec2f08d4-92eb-469a-b774-a5b56acd9ed9.png";
export const dinnerImg = "0a8d7fa0-a280-48df-ab0a-fc560d072630.png";
export const purpleImg = "8ac5cf50-5dcd-4211-b807-961cf8d15b65.png";
export const rabbitImg = "5c149380-22d6-4079-9341-5619220a95a6.png";
export const orangeImg = "bfca7cb1-152d-444d-9079-63c02bc5be04.png";
export const turnImg = "6edd6e31-b106-4e40-a3ed-8dadc3fd1458.png";
export const dearImg = "6c0c6b89-bd1f-4a1f-b90c-a31380aa3a76.png";
export const earthImg2 = "eb2c2d52-7af7-4e68-8b68-b338d557d06a.png";
export const sootheImg = "6c0d5c87-1124-4d25-b001-f5e3de7897d3.png";
export const lazyImg = "7b1602ca-654e-4417-810a-e4d8ea426ded.png";
export const perkImg = "d48bbeb1-5259-47c3-9e78-f14398bbf540.png";
export const earImg = "8354dc10-9a27-427e-a321-00cb0af76217.png";
export const royalImg = "d93a659d-38dd-45fe-b297-1a9a9e1202bb.png";
export const purpleImg2 = "f6cbb8d5-29ba-4423-b217-7393e6581bc8.png";

// --- M2 Audio Assets ---
export const mathAudio = "3df012f3-115a-4ad1-8aa9-ee87f515eaf2.wav";
export const breatheAudio = "f3152aa6-a790-450c-8ad7-067bd5db94e3.wav";
export const jumpAudio = "78b96ba2-c645-4120-900c-439911755c14.wav";
export const singAudio = "57e3c6c4-02fc-4296-a3b2-6a1f7b876ba2.wav";
export const ringAudio = "496775d6-5d7e-4641-803e-5c9ceb4872c7.wav";
export const pathAudio = "6f034ba4-b038-47ad-9c07-f2eb1416a001.wav";
export const wingAudio = "2eb7bde8-bfef-4344-b356-f9c134debfe8.wav";
export const furAudio = "da8bca1a-10a3-4254-addc-cdf2c9dd79fd.wav";
export const runAudio = "a090cdbc-c1e1-4517-92a2-ee059ce0e3b4.wav";
export const birdAudio = "230e0f69-338f-416b-9877-56b3af6bd401.wav";
export const sonAudio = "f1b5c44d-9fd3-4b88-8ffd-aec516934318.wav";
export const chairAudio = "ab57f840-871d-47b4-9979-462b480229c8.wav";
export const fairAudio = "b0ee641e-6c17-48cf-9338-ede7557d91fc.wav";
export const zigAudio = "ef73e224-ba45-490a-88e1-b534f22e8f93.wav";
export const chatAudio = "d39f6ba8-cd7a-4888-88b5-3eda089c5fb4.wav";
export const logAudio = "fa9d6786-7dad-4c4c-872a-1b3ebad390f4.wav";
export const birdAudio2 = "107303d6-d26f-4c08-9c47-ae8d34f7c19c.wav";
export const penAudio = "c865673e-f0d9-4337-b7a2-a5d13198aa5d.wav";
export const nowAudio = "9d243449-a6ed-453b-9491-ef437ddc3713.wav";
export const careAudio = "28ee123c-8cc3-4b12-b0fe-f68c4d22c145.wav";
export const threeAudio = "b3939989-9c2f-429b-a379-6852d1a1a926.wav";
export const riverAudio = "b7ad3ddc-ccb7-43f6-96a7-1a8be3b86b30.wav";
export const thumbAudio = "ab6185bf-1401-46a4-9292-da64de3eeb24.wav";
export const earthAudio = "1e1ad1e4-269c-4297-bdc4-78507a85ef40.wav";
export const magicAudio = "31ff6855-d9af-4651-ae4a-59529cd045f4.wav";
export const motherAudio = "b2be0043-5c60-4d4e-b0d9-2068e31a2133.wav";
export const fatherAudio = "330a2792-a587-48bc-ba9b-c285733433e6.wav";
export const dinner2Audio = "275ae6ba-6503-4b8b-af80-dec4168cdd88.wav";
export const purpleAudio = "d73d37bc-bca1-455b-9b6f-4deec0db07a1.wav";
export const rabbitAudio = "75efaa14-988c-4104-b063-05ffe6e75880.wav";
export const orangeAudio = "b4d01756-ca2b-4ce3-9d41-33473874dab4.wav";
export const turnAudio = "e355974e-0282-4549-a433-87c186e762f7.wav";
export const dearAudio = "12ba8f54-9343-4123-a8bf-d1cc4c119c4e.wav";
export const earthAudio2 = "67edf0a4-0627-41bc-a13d-ccd59586ab52.wav";
export const sootheAudio = "79a018d9-dfd0-4ccc-870b-fb4c66a43a64.wav";
export const lazyAudio = "3837b020-7f4e-45e7-9c1f-51f9dca3bfe4.wav";
export const perkAudio = "dd9615ea-41d6-4adf-a720-0c8423aa1b20.wav";
export const earAudio = "ce3385c5-ab5e-4207-89e4-eca0538ab09b.wav";
export const royalAudio = "5ffbc133-268c-437c-8474-37c1f96499d8.wav";
export const purpleAudio2 = "821e3657-fc12-464e-b4e4-33a26ae1e811.wav";

// M1,M2 ==> P1,P3 Sound Hunt
// --- Image Assets ---
export const శనగImg = "566c671c-2653-485a-a3cc-b71103d2bb1a.png";
export const హసImg = "ae1874ab-c752-414a-bf3e-26f9b1c2b3a0.png";
export const పలకImg = "da8567e4-4f51-460c-9803-cd84fa72b054.png";
export const బడImg = "32bd7f1b-5f82-4a12-a717-2e788907a7ce.png";
export const నడకImg = "d520225f-3895-40cc-9c21-37d36a709603.png";
export const వనImg = "97241f7f-cccb-4bdd-a2cb-8a88fa8fd2a9.png";
export const రథImg = "bb2bb591-0564-4500-9d38-91de0c9b9176.png";
export const తబలImg = "f5c573d5-5886-49ed-8198-aadecdb08185.png";
export const ఫలImg = "00065fd7-1bfc-4b63-8243-5abfd71d8da3.png";
export const ఔషధImg = "ca0c773e-f1ae-411a-b200-8d79b2014cbe.png";
export const జకImg = "2bb2c373-a8a8-444a-8099-69058a901d03.png";
export const ఝషImg = "2760acc8-8930-42e6-8115-d838d784682f.png";
export const కజరImg = "6473d8db-16bd-4ca6-9041-095cc1f83d8d.png";
export const తలగడImg = "a5726bac-0c06-4e8b-bcec-5d152f4112fc.png";
export const మడImg = "eeaa2459-c9d0-486e-a4e1-826ed680d3ad.png";
export const గటImg = "5dc727d2-2a57-43cb-92a7-1167e532f03e.png";
export const జమImg = "68e6a297-2890-4e7f-a506-345e6f19419e.png";
export const పడవImg = "4fe7b901-a761-4226-b187-f6210f4a73b6.png";
export const దడImg = "7f875f16-9053-4caf-85a1-5862cc5560ba.png";
export const జలImg = "d100b571-d38e-4f36-8424-55a1cf768ad6.png";
export const తనImg = "dc3be6db-6e18-4e6f-8595-378e5cd40240.png";
export const వరImg = "f91af4a6-214b-4ca9-857c-455e48e020f6.png";
export const కదImg = "4a5c147d-fc08-4a8f-8abe-4218fd2a064f.png";
export const గడImg = "0e4dcead-e695-4afd-a85e-617b32892c71.png";
export const నరImg = "cb3dd4a8-2d28-48ba-8276-d4ec2b084358.png";
export const పలImg = "2cecf030-c463-4134-800e-4ef34bda33c6.png";
export const మడImg2 = "5cd2a0c8-bf38-419d-85ce-1ada07752a28.png";
export const బవImg = "2ebabe5a-49ca-4717-ae96-3d74f740ed95.png";
export const దగImg = "5f16aa1b-05f8-4687-b897-48baa262f2eb.png";
export const రణImg = "80de2768-08b6-4839-979e-0236e4dd4609.png";
export const ఏనగImg = "33b7fa07-44cc-4846-b6f6-ffcf1738d0a4.png";
export const పజరImg = "1dad5b07-25dc-4d9f-98a1-ce87ff847a55.png";
export const కడImg = "98f79dbd-734a-4bba-8172-5c7176587cf6.png";
export const తళImg = "6b5faa5e-03f1-49bb-b55a-75cd25b05821.png";
export const చయImg = "fae52caa-33e8-4574-8d0e-a80808ec70e8.png";
export const నరImg2 = "efcd1703-bb8e-41ca-8e33-3bb48ca015b9.png";
export const కలశImg = "3fa8473b-f06c-43d4-9b9a-1267d5e92ef9.png";
export const ఉడతImg = "310b0651-12a7-4590-9d26-6ecdeef2b68a.png";
export const కతలImg = "9935119d-c964-4934-8eca-622f83e8683d.png";
export const సనమImg = "52c86264-d207-42b1-93c3-d2d76d40104f.png";

// --- Audio Assets ---
export const శనగAudio = "65405f85-4878-4ab9-be5d-e659445dea89.wav";
export const హసAudio = "a3f9e44a-bd97-4344-a162-2ef54fac3f32.wav";
export const పలకAudio = "599e60e9-2beb-455e-a931-0c694f653552.wav";
export const బడAudio = "92535804-1da9-494f-92a0-6605d4008684.wav";
export const నడకAudio = "3ddc35e7-1d52-44c8-a6ff-5a4acfa14c21.wav";
export const వనAudio = "28fc45a0-d4ea-40e6-bba8-acc011ea8a40.wav";
export const రథAudio = "8de60283-9b80-4ace-b229-f6dc4573184c.wav";
export const తబలAudio = "aa3863e9-6c3d-41a7-8667-7920b92ba264.wav";
export const ఫలAudio = "96ac2128-cffd-4d28-8bc8-adcf66930856.wav";
export const ఔషధAudio = "c2442d91-fbd1-4aa9-9a10-fcb370c13ef0.wav";
export const జకAudio = "53e060c3-c916-4203-8dd4-d18b4dd1320c.wav";
export const ఝషAudio = "68ce414e-7b8e-4d98-bad4-334422659046.wav";
export const కజరAudio = "34fec431-bca7-4878-a703-4912b1b33345.wav";
export const తలగడAudio = "041db19d-17a6-4957-9656-eb5c2bf7db93.wav";
export const మడAudio = "91b74531-7c99-40ef-bab7-2d5bb9ec20fd.wav";
export const గటAudio = "875d5542-1155-416e-90df-42d7ac3f822f.wav";
export const జమAudio = "7b4dfdab-8c15-49e9-930f-ddc5ac3936ce.wav";
export const పడవAudio = "43849fa6-ea15-4c28-a1c4-7d6f3aeb34d2.wav";
export const దడAudio = "2f2a6384-3bd1-4a08-83b3-149ae447c76c.wav";
export const జలAudio = "8be665b6-0143-4c57-bcb7-22e8c567315c.wav";
export const తనAudio = "57bf6901-f17f-42a8-94f0-ab434c0b375f.wav";
export const వరAudio = "26825ccd-eb72-4f10-8fdb-a8920d56b390.wav";
export const కదAudio = "afe42a75-2f1c-49b9-bcbc-931e1a9b2cd2.wav";
export const గడAudio = "a0dc41ed-39d7-441b-9f2d-85ca982cad84.wav";
export const నరAudio = "80778098-c794-427c-be5a-3e7962b1ad23.wav";
export const పలAudio = "3d646dc3-1008-43c3-b1dc-fda03f65ac99.wav";
export const మడAudio2 = "9ee0c906-a79e-4903-84b0-606e264217f9.wav";
export const బవAudio = "327240a1-97d1-4187-8ddb-86a3300070f8.wav";
export const దగAudio = "8c349eec-268d-4a71-a5c2-b386afeaee73.wav";
export const రణAudio = "bd67670b-a6e2-47c7-88fd-842efc1fc5e9.wav";
export const ఏనగAudio = "d57bf30c-8dbe-4478-9ab2-b15b94d70122.wav";
export const పజర2Audio = "f9afd975-22a2-4dbe-9114-c7933a9dbd49.wav";
export const కడAudio = "6b1e11c6-3338-4938-b3d7-148eb89de545.wav";
export const తళAudio = "522f7ded-f911-46ca-bf8b-0f9e41be4527.wav";
export const చయAudio = "d939ed10-f27f-4f06-9f98-ab8e4f75e375.wav";
export const నరAudio2 = "8d24781f-573c-48ad-b6da-e1668424d3d2.wav";
export const కలశAudio = "89af9ce9-3666-43d1-8921-bc879b15e45f.wav";
export const ఉడతAudio = "ee13417d-13e7-4e85-83c1-9a32877a5db9.wav";
export const కతలAudio = "a2edf148-fbf1-4eba-90d1-569fe3edff7c.wav";
export const సనమAudio = "97be188f-5bf1-4325-8d9d-40f568ee5c10.wav";

// --- Image Assets ---
export const నపపImg = "4c2ebb99-38d7-49c5-840b-ed7efec293ad.png";
export const అననImg = "ccf63482-29f2-48a5-8787-39019876c587.png";
export const డబబImg = "5f96c67e-3cfe-4c10-976e-b600d4e63caf.png";
export const ధనయImg = "111439a1-9056-4f2f-a437-978baa931a9f.png";
export const బససImg = "621843a5-a108-41b2-a69b-364e0b80df0d.png";
export const పపపImg = "c5f39af4-669c-45c0-be8a-358e13199gta.png";
export const మకకImg = "b08fcf5b-1477-4dd0-8bcb-4263db008c03.png";
export const బటటImg = "ba005a1a-3e3b-44e5-a6ca-ff43d6e65e9b.png";
export const బవవImg = "569f99bf-ee7d-4772-8ff1-58d0b3081710.png";
export const మలలImg = "02a24ad3-f1e4-481d-b1e3-293ec2b4c9ae.png";
export const చకకImg = "2a3b41d2-7514-48ed-b132-2f3ca3c2f577.png";
export const వమనImg = "f8e227bc-afff-44be-9a8f-1a9be8567c50.png";
export const కరటImg = "987cc665-1fed-4462-9c31-519f501b2640.png";
// export const పజరImg = "7bf649b9-061c-4a7e-bd06-5ef707aac99a.png";
export const మకడImg = "a7065e39-398c-451c-a1aa-7e62926ae64a.png";
export const మసలImg = "24cd0e61-3787-428e-89a6-c3e5fe17664c.png";
export const అభనయImg = "e049435c-5af6-4e65-975a-ef53322d7b9d.png";
export const తపపImg = "0779d842-df69-4abb-a2b4-d814402ea364.png";
export const బడకయImg = "28061407-fed5-4ae1-aca2-5c8cb2b73e67.png";
export const బమమImg = "c93a64c9-6db3-45cd-905c-9edbc5c7f8e6.png";
export const పలలలImg = "e8312ef1-91bd-4d65-bd92-1a7e61dbc20a.png";
export const గమమడImg = "cf0a8c9f-1585-4e29-8e1c-749820d438ca.png";
export const మదదబతImg = "e81d456d-a085-4e61-a0d4-b798291a633a.png";
export const వరణమలImg = "b5b82b6f-b34a-4f21-b3e9-0874b08baa07.png";
export const పటటకImg = "517ab001-c994-4fe9-8fca-efbe8564d4c3.png";
export const వరషలImg = "b9d31a53-965a-4ad7-b533-7ee9e1fd629f.png";
export const బతకమమImg = "fab892d3-2e30-4f85-8150-5c250118bf43.png";
export const కయలడరImg = "431a7e7a-108b-4d49-abc2-ccb8b4e94b4c.png";
export const చలకమమImg = "1eb18b33-01fb-4643-974d-9c77afd87b22.png";
export const పలపటటImg = "aa5ef4c0-9f25-4858-989b-bd11f4d9deaf.png";
export const వదయలImg = "4108d667-d2a0-4683-bff3-6e7fbb939ffc.png";
export const దరవజImg = "bc526865-c1a8-4c93-92b5-8b9ddf84e10b.png";
export const వకషImg = "be1169e8-b5dd-49a5-a2c2-3e2cbfc9614e.png";
export const వననలImg = "9a1c3159-a689-4138-8b8e-39fd812597d5.png";
export const బరరకథImg = "80d1864a-56e2-4586-87ce-8a841f1373c9.png";
export const పరపచImg = "3d74ec0d-c6e4-49e6-b60c-f455702587b4.png";
export const ఇలలImg = "8b786a0c-0cac-408c-b393-71b20982b2b1.png";
export const చననImg = "55ae3f78-0cfa-4a9a-a78c-35ce33531769.png";
export const సరమలలImg = "351e4215-2d84-47b3-bbec-d038660d391b.png";
export const బయయImg = "2c6fdb4e-8b9e-4f35-b77f-5b4210a1df14.png";

// --- Audio Assets ---
export const నపపAudio = "177316b7-1900-4b35-8c72-b3f7c990de45.wav";
export const అననAudio = "9f7156fc-6a53-4962-94d1-520efc1b8ff0.wav";
export const డబబAudio = "5b12b736-921b-444e-b0c9-c212089435da.wav";
export const ధనయAudio = "7fd28210-a56d-4594-9cf2-4962fd7b1df7.wav";
export const బససAudio = "43773676-cd64-47e5-9158-178df169d9cd.wav";
export const పపపAudio = "b3f6b915-0859-4426-ac99-54018e3dfaf9.wav";
export const మకకAudio = "fc61e9de-60d0-4a81-8c54-2a298ad3e673.wav";
export const బటటAudio = "90e8fa3d-1e60-4d2e-8b0f-31639ef81b07.wav";
export const బవవAudio = "85c2ffd1-8e49-4339-8019-5e43580b0aec.wav";
export const మలలAudio = "735a7eac-1957-47f6-8531-5d0c86983e2c.wav";
export const చకకAudio = "7bfb94c6-3a99-42e1-b7dd-992ec9fbb990.wav";
export const వమనAudio = "3759ff84-2e4a-4f56-b4c0-514c28855cd1.wav";
export const కరటAudio = "0309f14b-9877-451d-9f4b-7da2d2a1b540.wav";
export const పజరAudio = "f5f5a881-6b8c-4bb3-a46a-3de2e4872ae4.wav";
export const మకడAudio = "32dd19b1-4fec-48a2-94be-4d47130aa36e.wav";
export const మసలAudio = "faf880cc-e7fd-4e8b-84ef-43ada4025a35.wav";
export const అభనయAudio = "bd02095d-dbab-435b-ba42-6ae41d81e694.wav";
export const తపపAudio = "3b52b467-4acf-42d5-bb58-ef5d6f25db61.wav";
export const బడకయAudio = "3e23e7f6-103f-4b7e-af06-24b4479dc779.wav";
export const బమమAudio = "7eee0614-e34b-41c2-a370-0e663c9a98b9.wav";
export const పలలలAudio = "f957f334-8991-49fe-a722-d1a099084ffe.wav";
export const గమమడAudio = "91f83bee-f795-476a-a282-e1de62890853.wav";
export const మదదబతAudio = "005791e3-bac0-4ab4-87e6-d7a53030af80.wav";
export const వరణమలAudio = "e3345c45-f281-4d5d-858e-5ca426b2c772.wav";
export const పటటకAudio = "f0f573aa-7c18-4dac-b007-4af7ab522879.wav";
export const వరషలAudio = "ab6ab236-98d0-4fd0-83c1-082e8bec849b.wav";
export const బతకమమAudio = "180ac0dd-f021-4a50-94f9-fdff31297e52.wav";
export const కయలడరAudio = "2f17629b-c768-4a14-8227-8613ef9bda08.wav";
export const చలకమమAudio = "6555cef3-5adf-4bb0-af32-0465a20d6ca8.wav";
export const పలపటటAudio = "f38910b6-65a3-43d4-8164-ae58f54800b1.wav";
export const వదయలAudio = "2807dc2e-9ea4-49a1-bb56-1908ef55958b.wav";
export const దరవజAudio = "77cb3cfd-2e7c-4921-ba04-7faa1bff9267.wav";
export const వకషAudio = "b5309f6a-7887-47d1-90d7-d1c957123a59.wav";
export const వననలAudio = "3a5dfc3f-d27b-44de-bdd8-69654483d9f3.wav";
export const బరరకథAudio = "9ffe8466-b96d-4d9c-bf2f-398e68877745.wav";
export const పరపచAudio = "b6711f57-1db0-45d6-ad52-3b6853da7433.wav";
export const ఇలలAudio = "2c7cab70-6afd-4f25-a108-9943c703718b.wav";
export const చననAudio = "df8da017-bf1e-49c5-a9cb-f334524b32ca.wav";
export const సరమలలAudio = "bf11d000-3541-4349-89fc-2cd7c6ea0df2.wav";
export const బయయAudio = "fc139f70-cb67-49ac-a2c1-836ec16d57cd.wav";

// --- M3 Telugu Image Assets ---
export const అమలపలకImg = "c8a9949f-a728-44e0-b2e3-dc286d50fdb7.png";
export const వపకచదImg = "91644b18-860d-4cdd-be52-d9052e12153b.png";
export const గననలపలImg = "948956ef-736c-4bee-a769-b793e9b84cd3.png";
export const బవగరకImg = "1e383257-d413-4ba6-b46b-94bc3e7fa1b3.png";
export const పసరగరలImg = "9c4aea67-aabc-4139-ae64-7d131ee046d6.png";
export const ఎరరగలబImg = "25c70abf-1afc-429f-a09a-23580116edc3.png";
export const సవరతజడImg = "36e092c9-a082-4b9c-beb0-64b41935967a.png";
export const కడమదగడImg = "67882140-754b-4baf-8ca1-0e29e4d23bbc.png";
export const చతలగడగImg = "ba9db3d5-4c97-4111-8118-89774c851d86.png";
export const తలలనఏనగImg = "163de671-439a-4bd3-9685-f34ae1781b72.png";
export const సననయపటImg = "79b957ff-89c9-4f97-8a1a-158ab78adbd6.png";
export const అకకజడImg = "f484b5c6-b9c1-4468-ae3d-5983db19ce6b.png";
export const గడమదబలలImg = "b55ea3fe-4b10-4ba9-9127-c5a53179e979.png";
export const తలమదటపImg = "2f8eab95-2556-4ebf-a095-d9151e027a9d.png";
export const బదలనళలImg = "86f4f2e7-74e0-49c7-9f6f-6020f52acbb3.png";
export const చటటమలకImg = "074841c2-7417-4d31-bc67-a72595aa5f1d.png";
export const చలకమకకImg = "827d0369-f2c5-4302-811f-1baa46cd58bb.png";
export const పలలపటటImg = "7e8f9399-5797-46ab-8b7d-99836e9042a0.png";

// --- M3 Telugu Audio Assets ---
export const వపకచదAudio2 = "82cb8888-73d0-413f-a5e7-944fe796b8da.wav";
export const కడమదగడAudio2 = "49e13b86-9fc1-4772-ba0b-b9b45554e4ad.wav";
export const అమలపలకAudio = "c89f13a7-e355-4bba-9a0b-36a935cc2262.wav";
export const వపకచదAudio = "17d2517a-82a0-4eca-9fc4-27d9b1f1dd33.wav";
export const గననలపలAudio = "ad9c153c-24b4-42a8-bacd-4cd4c64057bf.wav";
export const బవగరకAudio = "be1f2e4a-1780-4de4-9053-7e69666541e3.wav";
export const పసరగరలAudio = "418008cf-389e-4719-82bf-28f5eeda3b20.wav";
export const ఎరరగలబAudio = "af6f5b0d-46fd-4689-8359-5ef8df2e9325.wav";
export const సవరతజడAudio = "74a10681-ee8d-4fd6-bd47-d620a94f3ee3.wav";
export const కడమదగడAudio = "a64437f3-3b37-469d-8c05-06fac958b51b.wav";
export const చతలగడగAudio = "d3016756-29a6-4434-b135-a7ef0b8bb899.wav";
export const తలలనఏనగAudio = "9ff6e257-cbc6-4a16-94b2-493c32c31501.wav";
export const సననయపటAudio = "84db9492-a10c-42a8-809d-8bf320c93f3f.wav";
export const అకకజడAudio = "02631590-fcd0-4235-97f4-ff336fe6a387.wav";
export const గడమదబలలAudio = "c996ce62-3ea2-4dfd-9979-d739a7f7d738.wav";
export const తలమదటపAudio = "f396e9b1-2e3d-42d6-847d-b466b9fd940f.wav";
export const బదలనళలAudio = "bf58a00e-231d-4e52-9eb9-bfe6a7d47731.wav";
export const చటటమలకAudio = "439f1d46-dcb4-4a09-868c-ad7a7c4d6c9d.wav";
export const చలకమకకAudio = "fb629dc9-a338-4d06-8c39-cffef136bd7c.wav";
export const పలలపటటAudio = "8bf89a5c-78d9-489e-ac99-69336b022165.wav";

//Kannada SoundHunt.jsx assets
export const ವನImg = "4572893f-2206-4457-8d4f-b07bc23b191e.png";
export const ಮಜImg = "cedd08bd-d493-49f8-830e-2c62c5cdfgta.png";
export const ಸಮಯImg = "d75f0d69-f504-411f-8564-25708847a05a.png";
export const ದನImg = "e69711be-a481-49ba-ac0f-b20c9b749c64.png";
export const ರಥImg = "3bacbdd6-7d26-402e-9e68-324c0b0f3002.png";
export const ಪಟImg = "083bd50f-3d1f-4b07-8925-8c53001c4ca7.png";
export const ರಸImg = "20539921-d599-4a7f-b819-293a73ab06f7.png";
export const ಫಲಕImg = "052c63e6-f5e4-4eda-96e3-e02369a6c724.png";
export const ಶರImg = "e7ed7db6-1d7a-415d-be29-5cdf6037de99.png";
export const ನಗರImg = "81298a1b-a0a6-43af-9854-2d3294330874.png";
export const ಶಲImg = "292548aa-83af-4d0f-9a58-17f080d49a9d.png";
export const ಕಗImg = "5dac9093-2c65-42d1-89f5-f92c0f05095c.png";
export const ನರImg = "608b0264-2b71-4896-8f0b-de4e750e6142.png";
export const ತಟImg = "d7c62b76-a387-472b-b1de-d8dd826e1dc9.png";
export const ಭನImg = "67fb4756-e4c1-4ff4-bd3c-aaecd8ec9937.png";
export const ನಡImg = "67897651-aa13-416d-8cd3-6af231a35151.png";
export const ಸದರImg = "25573719-4b55-41aa-897b-1759dae4a880.png";
export const ಮರImg = "8b3da8bb-f69e-470d-9d25-4f1e60f4c207.png";
export const ಮಲImg = "dacfc68e-c3a5-4881-a023-da4257a3e7a6.png";
export const ಎರಡImg = "8b517447-a369-409e-a321-a952d55632fe.png";
export const ಹಟಟImg = "faf257be-caa2-4a9d-a722-56009f8596fb.png";
export const ಬಟಟImg = "bc5b46ce-b196-4565-9f67-4868fc408b20.png";
export const ತಮಮImg = "b5b7b972-f042-4171-a9db-9262f77bce45.png";
export const ಪರಶನImg = "7b99dbc2-aaaf-4cf6-a221-a2d8a13f83f5.png";
export const ಪರಣImg = "341dd900-740a-47fa-9fe3-49e3439eb007.png";
export const ವಕಯImg = "f654ccf6-0c01-4324-8f9a-4d8910e3b14b.png";
export const ಚತರImg = "b577d632-dc64-498f-bc84-1365f3a95a97.png";
export const ಬಲಲImg = "38d1cfdd-be25-4b69-a75b-7b64053c79f6.png";
export const ಹದನಲಕImg = "643b40d9-f66b-413a-81da-d8ffa8033e44.png";
export const ವದಯರಥImg = "b213d640-514c-4fb7-add0-8f0705f508ca.png";
export const ನರಮಣImg = "cb90d1dd-579e-49a3-9eb7-ddb81b4e8416.png";
export const ಬಳಹಣಣImg = "97ae20bb-91c0-47aa-a2f7-9542c65c2e2c.png";
export const ಭತತಪತರImg = "f1cf489a-bf4a-45b7-8d8e-e9b32f085f85.png";
export const ಯಕಷಗನImg = "cedd08bd-d493-49f8-830e-2c62c5cdfb40.png";
export const ವನAudio = "8a778626-778b-4efa-8ee2-32ef97f2010d.wav";
export const ಮಜAudio = "fd6d258a-1a84-4aa7-ae3b-424a42fdb2aa.wav";
export const ಸಮಯAudio = "aa3b6119-97a1-4203-bfb2-39a75d72e2fb.wav";
export const ದನAudio = "9487310a-5332-4a55-98db-d804372e8149.wav";
export const ರಥAudio = "7e9db1c5-8057-45ac-ba1a-0cce20192e71.wav";
export const ಪಟAudio = "c4dbaef4-2079-4c76-8df7-1473980a7e59.wav";
export const ರಸAudio = "914e2c89-bee2-439e-bc58-6dbcf24d6ee9.wav";
export const ಫಲಕAudio = "dbb510ff-b197-4f1a-9488-2085fb5382c0.wav";
export const ಶರAudio = "5d1fb8fb-7795-4ab6-8f59-c17b04257b0b.wav";
export const ನಗರAudio = "850c96f8-d4db-44a2-86b0-6fb3dec67bd6.wav";
export const ಶಲAudio = "1e6cf8d2-40a3-45fe-b761-6bfa08bc2aed.wav";
export const ಕಗAudio = "b4d4e2e3-28ff-48b4-abc6-458f43607193.wav";
export const ನರAudio = "49ef4e5d-89fa-4fb2-b583-c4e9ecf20e59.wav";
export const ತಟAudio = "4aa5c903-d552-4b35-9efa-1625080f63b7.wav";
export const ಭನAudio = "cab54ef1-aefd-4dc4-82c6-37af1deb0137.wav";
export const ನಡAudio = "5ee40f2a-a219-4bfd-9e61-54d9b926cf41.wav";
export const ಸದರAudio = "8b66d917-ec52-4100-aa0d-ef803f09fbb2.wav";
export const ಮರAudio = "3f2e6c51-21a8-4b3a-af66-9fc493c7caf4.wav";
export const ಮಲAudio = "8c95d72c-82d7-4e7d-b007-b9f836ccc365.wav";
export const ಎರಡAudio = "664c26f5-eb45-4ab2-8e69-77e02f6aa741.wav";
export const ಹಟಟAudio = "a2c34f1b-20d7-4a27-ab88-2a168e623b52.wav";
export const ಬಟಟAudio = "66584052-fe21-4326-bf89-d0eb9f6b850c.wav";
export const ತಮಮAudio = "bb14948f-69b5-4300-a1c1-3ecf345c38fa.wav";
export const ಪರಶನAudio = "63e4bf92-ef8d-4e38-9d33-bd43afef6d30.wav";
export const ಪರಣAudio = "4930fd00-8c12-4234-9cc2-42b9109737e8.wav";
export const ವಕಯAudio = "8ba79e1f-0efe-4923-b732-e5e047c9ffef.wav";
export const ಚತರAudio = "bcf93b7f-8446-404e-ab52-97d6d8fa4bbe.wav";
export const ಬಲಲAudio = "661afac7-eedf-4316-9068-eca2086f08a2.wav";
export const ಹದನಲಕAudio = "f4bb9198-f7a8-47ed-b3ea-597ecc3800cf.wav";
export const ವದಯರಥAudio = "6ff6c961-3a2c-4068-940b-6b517d0dea6a.wav";
export const ನರಮಣAudio = "870f081c-d172-4a9d-a796-e9f6b7d63b06.wav";
export const ಬಳಹಣಣAudio = "60132536-2a41-4b29-ab6e-d365655afcbf.wav";
export const ಭತತಪತರAudio = "cd74efea-508b-45fe-9c8c-5e9702130a11.wav";
export const ಯಕಷಗನAudio = "bf62faa8-7554-4b04-8be4-583a07f3677a.wav";
export const ವಯಯಮImg = "70e8d54c-3842-474b-beff-5369a030ec21.png";
export const ವಳಯದಲImg = "ba45c38a-33e4-46d0-9ecf-46e634fb89cd.png";
export const ಸರಯImg = "e00b98e4-48e0-4796-bac2-f85e673a5cce.png";
export const ಅಕಷರImg = "f8d73f87-67e3-410c-91b2-a7af3400601d.png";
export const ವಜಞನImg = "aa8041f1-334e-4361-b502-6b11bf362ea0.png";
export const ಉತಖನನImg = "454d0abe-e2f7-4606-82cc-f9351a5f65d8.png";
export const ಅಣಕಟಟImg = "322206a6-6641-4c41-ba7b-b1c540a76636.png";
export const ನಮಸಕರImg = "9491a419-7fc5-419b-998d-40e797e03e96.png";
export const ಕರನಟಕImg = "020f9d63-6b49-48fe-a4c0-7050ea6fdbae.png";
export const ವಯಯಮAudio = "92c3dc28-8ce7-4c6d-9b33-f680c8bc8f82.wav";
export const ವಳಯದಲAudio = "1ff3418d-cb2f-444d-ae14-2ab8100e42fe.wav";
export const ಸರಯAudio = "3f15ff9e-877e-447d-b7b3-f8c9d1cf4b63.wav";
export const ಅಕಷರAudio = "fe449bb5-e371-4668-9995-1cfc9665ba37.wav";
export const ವಜಞನAudio = "a282d543-227b-4ae7-a258-7165b9785d6e.wav";
export const ಉತಖನನAudio = "9e9447b1-f364-42ac-be21-b721713c2330.wav";
export const ಅಣಕಟಟAudio = "9af9a588-b0ce-4925-994d-64ef2f46d22d.wav";
export const ನಮಸಕರAudio = "d8061b9f-c7f1-4685-a1a6-dcfe2da8fb67.wav";
export const ಕರನಟಕAudio = "5145da81-4094-4aca-89a6-1848a8d92c70.wav";
export const ಕಪಪImg = "4d7dae21-16ea-47be-a5d8-988fd3f7d7e8.png";
export const ಪರಕತImg = "203612a6-564e-4996-a40a-65530799cca2.png";
export const ಕಮಮರImg = "30064d29-7ec0-4dfb-a06c-30ddeea726df.png";
export const ಹಬಬImg = "cf2079b4-bd9e-46f6-a4b5-357ac1e2b833.png";
export const ಅವವImg = "fce2ed3c-6a26-4aae-9e08-f36b0dcc243e.png";
export const ಉಯಯಲImg = "f1e58ca3-508c-4657-b4d9-cbf0c996bc23.png";
export const ಚದರImg = "a9c37320-0d67-416c-b89c-008c42eac98e.png";
export const ಬಸಸImg = "9b897fe6-7454-4102-b44a-b745709a19d0.png";
export const ಕಪಪAudio = "9a951cc2-3052-496e-80fa-20b3a8b9fc37.wav";
export const ಪರಕತAudio = "d512dfed-fedd-4689-ba72-ec43009b905b.wav";
export const ಕಮಮರAudio = "035a04cd-6cde-4ddb-8078-26237c4cfe13.wav";
export const ಹಬಬAudio = "cd58bdfa-cc21-45b8-b53c-da6aa81ccdd9.wav";
export const ಅವವAudio = "ceda831c-6c75-4963-991a-d3b9f855cc91.wav";
export const ಉಯಯಲAudio = "29fb933d-90d7-4376-a971-b8e1fa8fcd87.wav";
export const ಚದರAudio = "bf76e9c7-f317-4413-8685-fe6b89cb91c9.wav";
export const ಬಸಸAudio = "95f9f69a-b4e1-4bd9-bb43-fe761356808c.wav";

// Kannada SoundHuntS1Combined Assets
export const ಔಡಲImg = "bda01036-a759-464f-8dbc-f7bf5a186de0.png";
export const ಫಲImg = "f53faeb7-9167-4345-92a9-dcfe16f4d3da.png";
export const ಝಳImg = "c6f178df-d055-44bd-875a-41c78d1edcf3.png";
export const ನಳImg = "785a6269-91bb-4c96-8706-cc9b572f1a72.png";
export const ಹಯImg = "f7659da7-4513-4bc6-9a52-4f65ded18d38.png";
export const ಗರಗಸImg = "d3227ef7-fbee-451b-ad83-4410c9106bdc.png";
export const ಆವರಣImg = "0e8ff4b3-3567-4daf-a790-1a902908a5b4.png";
export const ಕದImg = "a43374d5-ea5e-4e41-9f21-5b6246e33b81.png";
export const ತಬಲImg = "27b5af48-fe23-4e73-a08e-9f137d6440e4.png";
export const ಮನImg = "8cff48d5-5684-42f9-b69b-61a2022dd02a.png";
export const ಬಯImg = "1736c49b-0f6d-40d6-afa1-a5854d9c6d78.png";
export const ತರಣImg = "038ace5d-35fd-42af-b579-183cecb1a9fb.png";
export const ತಯImg = "ba3ea044-af8b-4d80-bebf-86a3c25608bb.png";
export const ಕವರImg = "499c8a12-59de-4bb5-ab19-6fee60cffdce.png";
export const ಕಳImg = "8ea12ddd-5dd0-4f5f-aea3-65a332857d7c.png";
export const ಮಸದImg = "12531d1d-cfe1-41c0-918f-44ac888e8529.png";
export const ಔಡಲAudio = "35cde64b-b6ba-4d33-9667-380abfaef532.wav";
export const ಫಲAudio = "359afea3-4783-467a-9564-f32db5ce6e7e.wav";
export const ಝಳAudio = "8de7a576-ade3-4dbc-8428-d9bf85c53826.wav";
export const ನಳAudio = "7022f093-6246-41ae-8acf-02c587067057.wav";
export const ಹಯAudio = "b700af3d-e308-414e-9cea-a393a8fd0530.wav";
export const ಗರಗಸAudio = "98a3930a-8acd-4ed7-972c-576390e9ae61.wav";
export const ಆವರಣAudio = "2e6f254f-ff7b-4465-a76d-ea2972691a6c.wav";
export const ಕದAudio = "8381aa6e-a012-4e0a-9ab2-7dd2d90cfad1.wav";
export const ತಬಲAudio = "084cf2aa-34c6-4bb9-a54d-883bf758301e.wav";
export const ಮನAudio = "a1516c2b-1030-4b61-8a05-ef63490a686d.wav";
export const ಬಯAudio = "eae75bac-06d5-4663-bb40-f5b44b28ceb3.wav";
export const ತರಣAudio = "ba3c56f9-e351-4ef8-ba68-8eb56d1f0ec7.wav";
export const ತಯAudio = "43e61870-cb90-49a1-966d-169c66996afe.wav";
export const ಕವರAudio = "036d5717-f5d0-46e5-88f6-44c276d11ea9.wav";
export const ಕಳAudio = "b525dadd-fa88-4133-af02-24fa7ffb5849.wav";
export const ಮಸದAudio = "afc08661-67c6-4aff-b7a9-78d2d9d3aba8.wav";
export const ಕಣಣImg = "a5cf4d7b-7799-4d27-b434-e40fad0b1db6.png";
export const ಜಕಲImg = "b3f6103e-cc85-4b1b-bc7e-370c3838b8e4.png";
export const ವಗರಹImg = "065516ea-607b-4996-bd2d-ab3ef68a96de.png";
//export const ಹಗಗImg = "6b3eb028-dde3-43d0-934d-7943b112a850.png";
export const ರಕತನಳImg = "f1a0645c-8376-4e86-8b7e-bc58af789108.png";
export const ಮಕಕಳImg = "39d79439-f985-4a51-9911-a4672e2f8406.png";
export const ಸಬಹಣಣImg = "59d36d85-ce54-488c-91ba-6c5f8b231899.png";
export const ಧನಯImg = "ae7f5702-bf52-4787-9738-80fc73dc6a44.png";
export const ನಕಷತರImg = "a08e12de-1862-4400-9524-2bb1f2123eec.png";
export const ಮವತತImg = "8d260f28-56df-4725-b7fd-876fe9d39ef8.png";
export const ಕಣಣAudio = "f2a08828-c661-48e0-bed9-e3c8ca78b4d1.wav";
export const ಜಕಲAudio = "499d8a11-8271-4eed-88fc-5571719a4f2d.wav";
export const ವಗರಹAudio = "747ac496-359c-49dd-ac6d-272c1f12333a.wav";
export const ರಕತನಳAudio = "0cf80ff3-678c-4f01-ba80-8402d434809c.wav";
export const ಮಕಕಳAudio = "a6e01c5a-0d91-4983-953a-c25da7408d04.wav";
export const ಸಬಹಣಣAudio = "a58fa68f-c713-4f45-8ffc-dd2417baa005.wav";
export const ಧನಯAudio = "4beab937-89e5-4383-8e27-6f119e127e29.wav";
export const ನಕಷತರAudio = "c291c570-afde-48ce-b1a7-faca14ae65d8.wav";
export const ಮವತತAudio = "8d888fda-1aea-4f37-835b-79400b82419e.wav";
export const ಅದದಸರImg = "dea31bfb-e212-4408-8325-0f0f5d704640.png";
export const ಚದರಬದImg = "f8842a1d-82a1-485a-9a08-969ae87c50eb.png";
export const ಮರಒಣಗದImg = "0195990f-1bd2-4522-af50-b55dd27e0a52.png";
export const ಅದಗಡImg = "57e5adaa-6126-4832-94d8-af9d144dc877.png";
export const ಚಡಹImg = "81d9e9cd-26d5-4e7b-b0b9-e5c64b058fcd.png";
export const ಮವನಮರImg = "60eefe7d-dac7-48ee-b5da-a1ff101a8636.png";
export const ಗಳಯರಮತಕತImg = "d608a59c-f8bc-4cad-ab56-0400990d849e.png";
export const ಇದಮಸದImg = "4ff75192-be61-484e-b8ff-a51097fab289.png";
export const ಉದಯನಮನImg = "20b978ac-2695-4f71-9d30-2bbf57e8cd4a.png";
export const ಖಖಆಟImg = "2fb4c122-4a91-44b7-a0aa-8b1b6185b80b.png";
export const ಏಳಎಲಗಳImg = "16a60b9d-8c6e-4873-b05a-b331fb88c47e.png";
export const ಬಗಲನತರಣImg = "Torana.png";
export const ಆಕಶದತರಗಳImg = "stars.png";
export const ಕಡನಪರಣಗಳImg = "Forest_WD.png";
export const ನವಲನನರತನImg = "dancing-peaock.png";
export const ರಚಯದಸರImg = "Sambaaru.png";
export const ದಸವಳಗಡಗಳImg = "Hebiscus-plants.png";
export const ಆಗಸದಚದರImg = "moon.png";
export const ಉಯಯಲಆಡವನImg = "Swing-2.png";
export const ನಲಕಎಲಗಳImg = "Four-leaves.png";
export const ಅದದಸರAudio = "4302f959-c6c3-4243-bf6f-a5920335656e.wav";
export const ಚದರಬದAudio = "0094a893-b80c-4682-986a-f0fddcb2acff.wav";
export const ಮರಒಣಗದAudio = "0195990f-1bd2-4522-af50-b55dd27e0a52.wav";
export const ಅದಗಡAudio = "8f1771bc-7f84-4479-9d37-014f85da38f4.wav";
export const ಚಡಹAudio = "f95a5941-0dbf-492f-a603-bb3a94635361.wav";
export const ಮವನಮರAudio = "dfa08439-a23b-40ec-b788-916b55129981.wav";
export const ಗಳಯರಮತಕತAudio = "88ce7c3c-a641-4163-bb81-0f12713a2846.wav";
export const ಇದಮಸದAudio = "c2f11c92-38d3-4d18-983d-e2a5bd88d3c7.wav";
export const ಉದಯನಮನAudio = "e9f42cc1-0655-408a-b245-cba43bcd87eb.wav";
export const ಖಖಆಟAudio = "98f941b9-af47-4e73-89b9-66322d56400d.wav";
export const ಏಳಎಲಗಳAudio = "16a60b9d-8c6e-4873-b05a-b331fb88c47e.wav";
export const ಬಗಲನತರಣAudio = "0ffef894-0ce8-4701-bb25-efd75b8ee2ad.wav";
export const ಆಕಶದತರಗಳAudio = "a1d5e66d-ebc4-4fd3-8adb-07178eca8be3.wav";
export const ಕಡನಪರಣಗಳAudio = "3b2f494f-36b5-4818-9fba-8f282be8176a.wav";
export const ನವಲನನರತನAudio = "009752d7-2935-4153-b08f-3c81ad4e7a1b.wav";
export const ರಚಯದಸರAudio = "666841d0-9365-4e5e-a0f6-58bf423b0720.wav";
export const ದಸವಳಗಡಗಳAudio = "73d8a464-3745-47ea-b424-6c1de1a33602.wav";
export const ಆಗಸದಚದರAudio = "d25bd0d7-5430-49f9-bca9-2cff1aa35b9a.wav";
export const ಉಯಯಲಆಡವನAudio = "9722a000-9bb8-419b-a91a-d2205af6116a.wav";
export const ನಲಕಎಲಗಳAudio = "4b683839-4a39-4355-90db-97fc7fed6829.wav";
export const ಪರವಳImg = "acf1385c-3249-43db-9c9d-635dfdd32f17.png";
export const ಹಲಲImg = "0c6e2e26-faca-487b-b56a-547a66190d86.png";
export const ಕಟಕImg = "5d40cf35-a876-48ad-ba3d-ace8210deae2.png";
export const ಚಲಪಲImg = "350f2ea7-c6ea-437d-a92a-8bb2ab000bbd.png";
export const ಅಧಕರImg = "c9e08379-dd4c-4d00-8c90-c6ab4eb47712.png";
export const ಮಸಬImg = "353f53dd-13f6-4d39-a1bc-fa8df1768311.png";
export const ಸಡಲImg = "81d7a1f1-8dd1-47fd-bb4d-cbef5b9c4edd.png";
export const ಅಮಮImg = "b7a21cfc-36f5-483d-80a3-d7d3e466636e.png";
export const ಗಡಡImg = "e1abc26f-cbcb-46ff-b08e-26981f50226b.png";
export const ಪದಯImg = "463f519a-f5f8-437b-aaa8-9098b06bf384.png";
export const ಪರವಳAudio = "41b074e5-ecfb-4e4b-9efa-116764ae07b5.wav";
export const ಹಲಲAudio = "72add9f8-3b74-4129-ace1-9822c304c020.wav";
export const ಕಟಕAudio = "9fee25b5-856f-43a0-9388-083a6fab435d.wav";
export const ಚಲಪಲAudio = "0c5e7b96-7f4a-4db3-aba1-f54d6a1611bc.wav";
export const ಅಧಕರAudio = "998258e5-a594-4502-8e6d-e9998420dfce.wav";
export const ಮಸಬAudio = "e81b80e2-5cb1-459a-9ab1-b5f955fc97fd.wav";
export const ಸಡಲAudio = "84fdaf96-c799-41cd-b3b8-a2956f3821f7.wav";
export const ಅಮಮAudio = "76b60228-04f5-4885-ba92-7ebb07f66b32.wav";
export const ಗಡಡAudio = "9c4dadbd-23c7-4845-9501-1833e31df073.wav";
export const ಪದಯAudio = "659bfc82-727d-4f8b-9e43-3d876db41910.wav";
export const ಹತತImg = "409fa2ed-d032-4adf-9b15-d3b187081944.png";
export const ಜತರImg = "630d6266-8237-479c-abf3-89c48f49621f.png";
export const ಮಷಕರImg = "fe95b88d-1f50-48fe-9a44-104b13d180a3.png";
export const ಶಬದImg = "6f74e225-3441-4ab5-a80d-8261d745fc91.png";
export const ಸಮದರImg = "6a31a974-8a9d-48f8-a64a-f719104d2961.png";
export const ಮಗಗImg = "a716972f-b538-4a58-8076-ecab3e083d2d.png";
export const ಪಕಷImg = "69a05cae-1694-4652-92bf-f1259a504db3.png";
export const ಸನಹತImg = "7b4a0283-26d4-42b3-90d1-2b693ef52339.png";
export const ಗದದಲImg = "d4ec5684-d458-48c4-b96d-1cef8a964a5a.png";
export const ಹಳಳImg = "970749dd-fb78-4019-840e-fa5dbeb80896.png";
export const ಹತತAudio = "2d3178ef-a163-4dce-96ff-9e165121fc30.wav";
export const ಜತರAudio = "ea8bed9a-312a-445c-bf27-552a7b2a6b91.wav";
export const ಮಷಕರAudio = "15ee917e-1a8e-4c02-8171-e8c5aab65b52.wav";
export const ಶಬದAudio = "5e166785-5e4c-4bbc-bcbe-0049a2f165f1.wav";
export const ಸಮದರAudio = "81ac39db-a2ff-49e2-b2c5-30a4aac21fe5.wav";
export const ಮಗಗAudio = "c87c3144-9df5-4dd9-a9d9-b6680ed39d51.wav";
export const ಪಕಷAudio = "0bd2c9c6-bd11-4e15-8c62-18d9a33136b7.wav";
export const ಸನಹತAudio = "6f7da8eb-fcfc-499a-a14a-a11a611b70cd.wav";
export const ಗದದಲAudio = "45556673-42bd-4b8f-b368-ea5735d5fe4b.wav";
export const ಹಳಳAudio = "261d5365-a829-4772-981c-8c60ae3c80f5.wav";

/////////////////////////////////////////////////////////////////

// Temp Fix

export const bagR1ThreeAudio = "";
export const bagR1TwoAudio = "";
export const capR1ThreeAudio = "";
export const capR1TwoAudio = "";
export const dogR1ThreeAudio = "";
export const dogR1TwoAudio = "";
export const eggR1ThreeAudio = "";
export const eggR1TwoAudio = "";
export const fanR1ThreeAudio = "";
export const fanR1TwoAudio = "";
export const hatR1ThreeAudio = "";
export const hatR1TwoAudio = "";
export const pillowR1ThreeAudio = "";
export const ropeR1ThreeAudio = "";
export const shopAudio = "";
export const AppleAudio = "";
export const basketAudio = "";
export const sunsetAudio = "";
