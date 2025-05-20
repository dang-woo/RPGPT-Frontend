export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">제1조 (총칙)</h2>
        <p className="mb-2">
          [RPGPT] (이하 '회사')은(는) 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
        </p>
        <p className="mb-2">
          회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
        </p>
        <p className="mb-2">
          회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">제2조 (개인정보의 수집 항목 및 이용 목적)</h2>
        <p className="mb-2">
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>회원 가입 및 관리: 회원 식별, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등</li>
          <li>서비스 제공: 콘텐츠 제공, 맞춤 서비스 제공, 본인인증 등</li>
          <li>신규 서비스 개발 및 마케팅·광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 등</li>
        </ul>
        <p className="mb-2">수집항목 (예시):</p>
        <ul className="list-disc list-inside mb-2">
          <li>필수항목: 이메일 주소, 비밀번호, 닉네임</li>
          <li>선택항목: 이름, 연락처</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">제3조 (개인정보의 처리 및 보유 기간)</h2>
        <p className="mb-2">
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <p className="mb-2">
          각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>회원 가입 및 관리: 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지</li>
          <ul className="list-disc list-inside ml-4">
            <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
            <li>홈페이지 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
          </ul>
          <li>서비스 제공: 서비스 공급완료 및 요금결제·정산 완료 시까지</li>
        </ul>
      </section>

      {/* 추가적인 개인정보처리방침 내용을 여기에 계속해서 작성할 수 있습니다. */}
      {/* 예: 개인정보의 제3자 제공, 개인정보의 파기, 이용자의 권리와 그 행사방법 등 */}

      <section>
        <h2 className="text-2xl font-semibold mb-3">제4조 (개인정보처리방침 변경)</h2>
        <p className="mb-2">
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>

      <p className="mt-8 text-sm text-gray-600">
        본 개인정보처리방침은 [시행일자 예: 2025년 07월 01일]부터 시행됩니다.
      </p>
    </div>
  );
} 