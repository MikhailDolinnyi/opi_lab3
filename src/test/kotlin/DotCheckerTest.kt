import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import ru.mikhail.lab3.DotChecker

class DotCheckerTest {

    private lateinit var dotChecker: DotChecker

    @BeforeEach
    fun setUp() {
        dotChecker = DotChecker
    }


    @Test
    fun testCheckDot() {

        assertTrue(dotChecker.checkDot(-1F, -1F, 3F))
        assertTrue(dotChecker.checkDot(1F, -1F, 2F))

        assertFalse(dotChecker.checkDot(-1F, 1F, 2F))
        assertFalse(dotChecker.checkDot(2F, 2F, -1F))
    }


    @Test
    fun testCheckFirstQuarter() {

        assertTrue(dotChecker.checkFirstQuarter(0.5F, 0.5F, 3F))
        assertTrue(dotChecker.checkFirstQuarter(0F, 0F, 2F))
        assertTrue(dotChecker.checkFirstQuarter(0F, 1.5F, 3F))

        assertFalse(dotChecker.checkFirstQuarter(1F, 1F, 3F))
        assertFalse(dotChecker.checkFirstQuarter(2F, 2F, 1F))
    }

    @Test
    fun testCheckSecondQuarter() {

        assertFalse(dotChecker.checkSecondQuarter())

    }

    @Test
    fun testCheckThirdQuarter() {

        assertTrue(dotChecker.checkThirdQuarter(-3F, -3F, 3F))
        assertTrue(dotChecker.checkThirdQuarter(0F, 0F, 2F))

        assertFalse(dotChecker.checkThirdQuarter(-3F, -4F, 3F))
        assertFalse(dotChecker.checkThirdQuarter(-1.1F, -1.1F, 1F))
    }

    @Test
    fun testCheckFourthQuarter() {

        assertTrue(dotChecker.checkFourthQuarter(0F, 0F, 1F))
        assertTrue(dotChecker.checkFourthQuarter(1F, -1.5F, 2F))

        assertFalse(dotChecker.checkFourthQuarter(0F, -1.1F, 1F))
        assertFalse(dotChecker.checkFourthQuarter(2F, -2F, 2F))

    }


}